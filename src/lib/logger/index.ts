/**
 * Module: Application Logger
 * Description: Centralized logging system with multiple transports and log levels
 * Dependencies: config
 * Notes: All application logging should go through this module
 * @module logger
 */

import { config } from '../../config';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  OFF = 99,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
}

/**
 * Log transport interface
 */
export interface LogTransport {
  name: string;
  minLevel: LogLevel;
  log(entry: LogEntry): void | Promise<void>;
}

/**
 * Console transport for browser console logging
 */
export class ConsoleTransport implements LogTransport {
  name = 'console';
  minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.DEBUG) {
    this.minLevel = minLevel;
  }

  log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;

    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${LogLevel[entry.level]}] [${entry.module}]`;
    const message = `${prefix} ${entry.message}`;

    const style = this.getConsoleStyle(entry.level);
    const logData: any[] = [style ? `%c${message}` : message];

    if (style) {
      logData.push(style);
    }

    if (entry.data) {
      logData.push(entry.data);
    }

    if (entry.error) {
      logData.push(entry.error);
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(...logData);
        break;
      case LogLevel.INFO:
        console.info(...logData);
        break;
      case LogLevel.WARN:
        console.warn(...logData);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(...logData);
        break;
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: gray; font-weight: normal;';
      case LogLevel.INFO:
        return 'color: black; font-weight: normal;';
      case LogLevel.WARN:
        return 'color: orange; font-weight: bold;';
      case LogLevel.ERROR:
        return 'color: red; font-weight: bold;';
      case LogLevel.CRITICAL:
        return 'color: white; background: red; font-weight: bold; padding: 2px 4px;';
      default:
        return '';
    }
  }
}

/**
 * LocalStorage transport for persistent logging
 */
export class LocalStorageTransport implements LogTransport {
  name = 'localStorage';
  minLevel: LogLevel;
  private maxEntries = 1000;
  private storageKey = 'app-logs';

  constructor(minLevel: LogLevel = LogLevel.WARN) {
    this.minLevel = minLevel;
  }

  log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;
    if (typeof window === 'undefined') return;

    try {
      const logs = this.getLogs();
      logs.push(this.serializeEntry(entry));

      // Trim old logs
      if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      // Fail silently if localStorage is full or unavailable
    }
  }

  getLogs(): any[] {
    if (typeof window === 'undefined') return [];

    try {
      const logsStr = localStorage.getItem(this.storageKey);
      return logsStr ? JSON.parse(logsStr) : [];
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  private serializeEntry(entry: LogEntry): any {
    return {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
      level: LogLevel[entry.level],
      error: entry.error
        ? {
            message: entry.error.message,
            stack: entry.error.stack,
            name: entry.error.name,
          }
        : undefined,
    };
  }
}

/**
 * Remote transport for sending logs to a server
 */
export class RemoteTransport implements LogTransport {
  name = 'remote';
  minLevel: LogLevel;
  private buffer: LogEntry[] = [];
  private batchSize = 10;
  private flushInterval = 5000;
  private flushTimer?: number;
  private endpoint: string;

  constructor(endpoint: string, minLevel: LogLevel = LogLevel.ERROR) {
    this.minLevel = minLevel;
    this.endpoint = endpoint;
    this.startBatching();
  }

  async log(entry: LogEntry): Promise<void> {
    if (entry.level < this.minLevel) return;

    this.buffer.push(entry);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  private startBatching(): void {
    if (typeof window === 'undefined') return;

    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Put logs back in buffer to retry
      this.buffer.unshift(...logs);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

/**
 * Main Logger class
 */
export class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private minLevel: LogLevel;
  private sessionId: string;

  private constructor() {
    this.minLevel = config.environment === 'production' ? LogLevel.WARN : LogLevel.DEBUG;

    this.sessionId = this.generateSessionId();

    // Setup default transports
    this.setupTransports();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Create a module-specific logger
   */
  module(moduleName: string): ModuleLogger {
    return new ModuleLogger(moduleName, this);
  }

  /**
   * Add a transport
   */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport
   */
  removeTransport(name: string): void {
    this.transports = this.transports.filter((t) => t.name !== name);
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Internal log method
   */
  _log(entry: Omit<LogEntry, 'timestamp' | 'sessionId'>): void {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    if (fullEntry.level < this.minLevel) return;

    this.transports.forEach((transport) => {
      try {
        transport.log(fullEntry);
      } catch (error) {
        console.error(`Failed to log to ${transport.name}:`, error);
      }
    });
  }

  private setupTransports(): void {
    // Console transport
    this.addTransport(
      new ConsoleTransport(config.environment === 'production' ? LogLevel.WARN : LogLevel.DEBUG)
    );

    // LocalStorage transport for errors
    if (typeof window !== 'undefined') {
      this.addTransport(new LocalStorageTransport(LogLevel.ERROR));
    }

    // Remote transport in production
    if (config.environment === 'production' && config.api.baseUrl) {
      this.addTransport(new RemoteTransport(`${config.api.baseUrl}/api/logs`, LogLevel.ERROR));
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Module-specific logger
 */
export class ModuleLogger {
  constructor(
    private moduleName: string,
    private logger: Logger
  ) {}

  debug(message: string, data?: any): void {
    this.logger._log({
      level: LogLevel.DEBUG,
      module: this.moduleName,
      message,
      data,
    });
  }

  info(message: string, data?: any): void {
    this.logger._log({
      level: LogLevel.INFO,
      module: this.moduleName,
      message,
      data,
    });
  }

  warn(message: string, data?: any): void {
    this.logger._log({
      level: LogLevel.WARN,
      module: this.moduleName,
      message,
      data,
    });
  }

  error(message: string, error?: Error | any, data?: any): void {
    this.logger._log({
      level: LogLevel.ERROR,
      module: this.moduleName,
      message,
      error: error instanceof Error ? error : undefined,
      data: error instanceof Error ? data : error,
    });
  }

  critical(message: string, error?: Error | any, data?: any): void {
    this.logger._log({
      level: LogLevel.CRITICAL,
      module: this.moduleName,
      message,
      error: error instanceof Error ? error : undefined,
      data: error instanceof Error ? data : error,
    });
  }

  /**
   * Log performance metrics
   */
  perf(operation: string, duration: number, data?: any): void {
    this.logger._log({
      level: LogLevel.INFO,
      module: this.moduleName,
      message: `Performance: ${operation}`,
      duration,
      data,
    });
  }

  /**
   * Create a timer for performance logging
   */
  timer(operation: string): () => void {
    const start = performance.now();
    return (data?: any) => {
      const duration = performance.now() - start;
      this.perf(operation, duration, data);
    };
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
