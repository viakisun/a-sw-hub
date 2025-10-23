<script lang="ts">
	/**
	 * Deployments Page
	 * Extreme B&W design with ASCII symbols only
	 */

	import { onMount } from 'svelte';

	interface Environment {
		id: string;
		name: string;
		type: 'development' | 'staging' | 'production';
		status: 'healthy' | 'degraded' | 'down' | 'maintenance';
		version: string;
		lastDeployment: string;
		nextDeployment?: string;
		url: string;
		region: string;
		resources: {
			cpu: number;
			memory: number;
			storage: number;
			instances: number;
		};
		metrics: {
			uptime: number;
			responseTime: number;
			errorRate: number;
			throughput: number;
		};
	}

	interface Deployment {
		id: string;
		projectId: string;
		projectName: string;
		version: string;
		environment: string;
		status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
		deployedBy: string;
		startTime: string;
		endTime?: string;
		duration?: number;
		commit: string;
		branch: string;
		changeLog: string[];
		approvedBy?: string;
		rollbackAvailable: boolean;
		artifacts: {
			name: string;
			size: string;
			type: string;
		}[];
		checks: {
			name: string;
			status: 'pending' | 'running' | 'passed' | 'failed';
			duration?: number;
		}[];
	}

	interface DeploymentWindow {
		id: string;
		name: string;
		startTime: string;
		endTime: string;
		environments: string[];
		projects: string[];
		status: 'scheduled' | 'active' | 'completed' | 'cancelled';
		createdBy: string;
		description: string;
	}

	let activeTab = 'overview';
	let selectedEnvironment = 'all';
	let selectedProject = 'all';
	let selectedStatus = 'all';
	let showCompletedDeployments = true;
	let expandedDeployment: string | null = null;
	let autoRefresh = true;
	let refreshInterval: NodeJS.Timeout;

	// Mock data
	let environments: Environment[] = [
		{
			id: 'env-1',
			name: 'Production KR',
			type: 'production',
			status: 'healthy',
			version: 'v2.5.0',
			lastDeployment: '2024-03-15 10:30',
			nextDeployment: '2024-03-16 02:00',
			url: 'https://prod-kr.asw-hub.com',
			region: 'ap-northeast-2',
			resources: {
				cpu: 75,
				memory: 82,
				storage: 45,
				instances: 8
			},
			metrics: {
				uptime: 99.99,
				responseTime: 245,
				errorRate: 0.02,
				throughput: 15000
			}
		},
		{
			id: 'env-2',
			name: 'Production US',
			type: 'production',
			status: 'healthy',
			version: 'v2.5.0',
			lastDeployment: '2024-03-15 10:30',
			url: 'https://prod-us.asw-hub.com',
			region: 'us-east-1',
			resources: {
				cpu: 68,
				memory: 71,
				storage: 38,
				instances: 6
			},
			metrics: {
				uptime: 99.95,
				responseTime: 180,
				errorRate: 0.05,
				throughput: 12000
			}
		},
		{
			id: 'env-3',
			name: 'Staging',
			type: 'staging',
			status: 'degraded',
			version: 'v2.6.0-beta',
			lastDeployment: '2024-03-15 14:00',
			url: 'https://staging.asw-hub.com',
			region: 'ap-northeast-2',
			resources: {
				cpu: 45,
				memory: 52,
				storage: 25,
				instances: 2
			},
			metrics: {
				uptime: 98.5,
				responseTime: 320,
				errorRate: 2.5,
				throughput: 3000
			}
		},
		{
			id: 'env-4',
			name: 'Development',
			type: 'development',
			status: 'maintenance',
			version: 'v2.7.0-dev',
			lastDeployment: '2024-03-15 16:45',
			url: 'https://dev.asw-hub.com',
			region: 'ap-northeast-2',
			resources: {
				cpu: 20,
				memory: 25,
				storage: 15,
				instances: 1
			},
			metrics: {
				uptime: 95.0,
				responseTime: 450,
				errorRate: 5.0,
				throughput: 500
			}
		}
	];

	let activeDeployments: Deployment[] = [
		{
			id: 'deploy-1',
			projectId: 'proj-1',
			projectName: 'Smart Farm Monitor',
			version: 'v2.6.0',
			environment: 'staging',
			status: 'in_progress',
			deployedBy: 'Kim Developer',
			startTime: '2024-03-15 17:30:00',
			duration: 320,
			commit: 'abc123def',
			branch: 'release/2.6.0',
			changeLog: [
				'Improved sensor data collection',
				'Updated dashboard UI',
				'Fixed: Duplicate notification sending'
			],
			rollbackAvailable: true,
			artifacts: [
				{ name: 'app.jar', size: '45.2 MB', type: 'application' },
				{ name: 'config.yml', size: '2.3 KB', type: 'config' }
			],
			checks: [
				{ name: 'Build', status: 'passed', duration: 120 },
				{ name: 'Unit Tests', status: 'passed', duration: 85 },
				{ name: 'Integration Tests', status: 'running' },
				{ name: 'Deploy', status: 'pending' },
				{ name: 'Smoke Tests', status: 'pending' },
				{ name: 'Health Check', status: 'pending' }
			]
		},
		{
			id: 'deploy-2',
			projectId: 'proj-2',
			projectName: 'Crop Analytics',
			version: 'v1.8.2',
			environment: 'production',
			status: 'pending',
			deployedBy: 'Park Operations',
			startTime: '2024-03-16 02:00:00',
			commit: 'def456ghi',
			branch: 'main',
			changeLog: [
				'Improved analytics algorithm performance',
				'Enhanced report generation speed'
			],
			approvedBy: 'Lee Approval',
			rollbackAvailable: false,
			artifacts: [
				{ name: 'analytics.jar', size: '32.1 MB', type: 'application' }
			],
			checks: [
				{ name: 'Build', status: 'pending' },
				{ name: 'Unit Tests', status: 'pending' },
				{ name: 'Deploy', status: 'pending' },
				{ name: 'Health Check', status: 'pending' }
			]
		}
	];

	let deploymentHistory: Deployment[] = [
		{
			id: 'deploy-3',
			projectId: 'proj-1',
			projectName: 'Smart Farm Monitor',
			version: 'v2.5.0',
			environment: 'production',
			status: 'completed',
			deployedBy: 'Kim Developer',
			startTime: '2024-03-15 10:00:00',
			endTime: '2024-03-15 10:30:00',
			duration: 1800,
			commit: 'xyz789abc',
			branch: 'main',
			changeLog: [
				'Added new sensor support',
				'Improved notification system'
			],
			approvedBy: 'Lee Approval',
			rollbackAvailable: true,
			artifacts: [
				{ name: 'app.jar', size: '44.8 MB', type: 'application' }
			],
			checks: [
				{ name: 'Build', status: 'passed', duration: 115 },
				{ name: 'Unit Tests', status: 'passed', duration: 92 },
				{ name: 'Integration Tests', status: 'passed', duration: 340 },
				{ name: 'Deploy', status: 'passed', duration: 1200 },
				{ name: 'Smoke Tests', status: 'passed', duration: 60 },
				{ name: 'Health Check', status: 'passed', duration: 15 }
			]
		},
		{
			id: 'deploy-4',
			projectId: 'proj-3',
			projectName: 'Weather Service',
			version: 'v3.2.1',
			environment: 'production',
			status: 'rolled_back',
			deployedBy: 'Park Operations',
			startTime: '2024-03-15 08:00:00',
			endTime: '2024-03-15 08:15:00',
			duration: 900,
			commit: 'fail123xyz',
			branch: 'hotfix/memory-leak',
			changeLog: [
				'Attempted memory leak fix'
			],
			rollbackAvailable: false,
			artifacts: [
				{ name: 'weather.jar', size: '28.5 MB', type: 'application' }
			],
			checks: [
				{ name: 'Build', status: 'passed', duration: 95 },
				{ name: 'Unit Tests', status: 'passed', duration: 78 },
				{ name: 'Deploy', status: 'passed', duration: 600 },
				{ name: 'Health Check', status: 'failed', duration: 30 }
			]
		}
	];

	let deploymentWindows: DeploymentWindow[] = [
		{
			id: 'window-1',
			name: 'Regular Deployment - March Week 3',
			startTime: '2024-03-16 02:00',
			endTime: '2024-03-16 06:00',
			environments: ['production'],
			projects: ['proj-1', 'proj-2', 'proj-5'],
			status: 'scheduled',
			createdBy: 'Lee Approval',
			description: 'Monthly regular update deployment'
		},
		{
			id: 'window-2',
			name: 'Emergency Patch',
			startTime: '2024-03-15 23:00',
			endTime: '2024-03-15 23:30',
			environments: ['production', 'staging'],
			projects: ['proj-3'],
			status: 'scheduled',
			createdBy: 'Kim Emergency',
			description: 'Emergency security patch deployment'
		}
	];

	function getStatusColor(status: string): string {
		switch (status) {
			case 'healthy':
			case 'completed':
			case 'passed':
				return 'success';
			case 'degraded':
			case 'in_progress':
			case 'running':
				return 'warning';
			case 'down':
			case 'failed':
				return 'error';
			case 'maintenance':
			case 'pending':
			default:
				return 'default';
		}
	}

	function getEnvironmentIcon(type: string) {
		switch (type) {
			case 'production':
				return '■';
			case 'staging':
				return '□';
			case 'development':
				return '▣';
			default:
				return '▢';
		}
	}

	function handleDeploy(envId: string) {
		alert(`DEPLOY STARTED: ${envId}`);
	}

	function handleRollback(deployId: string) {
		if (confirm('ROLLBACK TO PREVIOUS VERSION?')) {
			alert(`ROLLBACK STARTED: ${deployId}`);
		}
	}

	function handlePauseDeployment(deployId: string) {
		alert(`DEPLOYMENT PAUSED: ${deployId}`);
	}

	function handleResumeDeployment(deployId: string) {
		alert(`DEPLOYMENT RESUMED: ${deployId}`);
	}

	function handleViewLogs(deployId: string) {
		alert(`VIEW LOGS: ${deployId}`);
	}

	function toggleDeploymentDetails(deployId: string) {
		expandedDeployment = expandedDeployment === deployId ? null : deployId;
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	}

	onMount(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(() => {
				console.log('Refreshing deployment data...');
			}, 30000);
		}

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval);
			}
		};
	});
</script>

<div class="deployments-container">
	<div class="deployments-header">
		<div>
			<h1>DEPLOYMENT MANAGEMENT</h1>
			<p>MANAGE DEPLOYMENT STATUS AND HISTORY BY ENVIRONMENT</p>
		</div>
		<div class="header-actions">
			<button class="btn-secondary">
				▤ DEPLOYMENT WINDOW
			</button>
			<button class="btn-primary">
				→ NEW DEPLOYMENT
			</button>
		</div>
	</div>

	<div class="deployments-tabs">
		<button
			class="tab"
			class:active={activeTab === 'overview'}
			on:click={() => activeTab = 'overview'}
		>
			◯ ENVIRONMENTS
		</button>
		<button
			class="tab"
			class:active={activeTab === 'active'}
			on:click={() => activeTab = 'active'}
		>
			~ ACTIVE DEPLOYMENTS
			{#if activeDeployments.length > 0}
				<span class="badge">{activeDeployments.length}</span>
			{/if}
		</button>
		<button
			class="tab"
			class:active={activeTab === 'history'}
			on:click={() => activeTab = 'history'}
		>
			○ DEPLOYMENT HISTORY
		</button>
		<button
			class="tab"
			class:active={activeTab === 'windows'}
			on:click={() => activeTab = 'windows'}
		>
			▤ DEPLOYMENT WINDOWS
		</button>
		<button
			class="tab"
			class:active={activeTab === 'rollback'}
			on:click={() => activeTab = 'rollback'}
		>
			↶ ROLLBACK MANAGEMENT
		</button>
	</div>

	{#if activeTab === 'overview'}
		<div class="environments-grid">
			{#each environments as env}
				<div class="environment-card" class:maintenance={env.status === 'maintenance'}>
					<div class="env-header">
						<div class="env-title">
							<span class="env-icon">{getEnvironmentIcon(env.type)}</span>
							<h3>{env.name}</h3>
							<span class="env-type {env.type}">{env.type.toUpperCase()}</span>
						</div>
						<span class="status-indicator {getStatusColor(env.status)}">
							{env.status === 'healthy' ? 'HEALTHY' :
							 env.status === 'degraded' ? 'DEGRADED' :
							 env.status === 'down' ? 'DOWN' : 'MAINTENANCE'}
						</span>
					</div>

					<div class="env-info">
						<div class="info-row">
							<span class="label">CURRENT VERSION:</span>
							<span class="value">{env.version}</span>
						</div>
						<div class="info-row">
							<span class="label">LAST DEPLOYMENT:</span>
							<span class="value">{env.lastDeployment}</span>
						</div>
						{#if env.nextDeployment}
							<div class="info-row">
								<span class="label">SCHEDULED DEPLOYMENT:</span>
								<span class="value highlight">{env.nextDeployment}</span>
							</div>
						{/if}
						<div class="info-row">
							<span class="label">URL:</span>
							<a href={env.url} class="value link" target="_blank">{env.url}</a>
						</div>
						<div class="info-row">
							<span class="label">REGION:</span>
							<span class="value">{env.region}</span>
						</div>
					</div>

					<div class="env-resources">
						<h4>RESOURCE USAGE</h4>
						<div class="resources-grid">
							<div class="resource">
								<span>▣</span>
								<span>CPU</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.cpu}%"></div>
								</div>
								<span class="percentage">{env.resources.cpu}%</span>
							</div>
							<div class="resource">
								<span>▪</span>
								<span>MEMORY</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.memory}%"></div>
								</div>
								<span class="percentage">{env.resources.memory}%</span>
							</div>
							<div class="resource">
								<span>▩</span>
								<span>STORAGE</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.storage}%"></div>
								</div>
								<span class="percentage">{env.resources.storage}%</span>
							</div>
						</div>
						<div class="instances">
							<span>▣</span>
							<span>INSTANCES: {env.resources.instances} RUNNING</span>
						</div>
					</div>

					<div class="env-metrics">
						<div class="metric">
							<span class="metric-label">UPTIME</span>
							<span class="metric-value">{env.metrics.uptime}%</span>
						</div>
						<div class="metric">
							<span class="metric-label">RESPONSE TIME</span>
							<span class="metric-value">{env.metrics.responseTime}ms</span>
						</div>
						<div class="metric">
							<span class="metric-label">ERROR RATE</span>
							<span class="metric-value {env.metrics.errorRate > 1 ? 'warning' : ''}">{env.metrics.errorRate}%</span>
						</div>
						<div class="metric">
							<span class="metric-label">THROUGHPUT</span>
							<span class="metric-value">{env.metrics.throughput.toLocaleString()}/m</span>
						</div>
					</div>

					<div class="env-actions">
						<button class="btn-primary" on:click={() => handleDeploy(env.id)}>
							→ DEPLOY
						</button>
						<button class="btn-secondary">
							○ MONITORING
						</button>
						<button class="btn-icon">
							▣
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 'active'}
		<div class="active-deployments">
			{#if activeDeployments.length === 0}
				<div class="empty-state">
					<span class="empty-icon">~</span>
					<h3>NO ACTIVE DEPLOYMENTS</h3>
					<p>ALL DEPLOYMENTS COMPLETED</p>
				</div>
			{:else}
				{#each activeDeployments as deployment}
					<div class="deployment-card {deployment.status}">
						<div class="deployment-header">
							<div class="deployment-info">
								<h3>{deployment.projectName}</h3>
								<div class="deployment-meta">
									<span class="version">{deployment.version}</span>
									<span class="environment {deployment.environment}">{deployment.environment.toUpperCase()}</span>
									<span class="branch">
										⊢ {deployment.branch}
									</span>
									<span class="commit">{deployment.commit}</span>
								</div>
							</div>
							<div class="deployment-status">
								<span class="status-badge {getStatusColor(deployment.status)}">
									{deployment.status === 'in_progress' ? 'DEPLOYING' :
									 deployment.status === 'pending' ? 'PENDING' :
									 deployment.status === 'completed' ? 'COMPLETED' :
									 deployment.status === 'failed' ? 'FAILED' : 'ROLLED BACK'}
								</span>
								{#if deployment.status === 'in_progress'}
									<span class="spin">⟳</span>
								{/if}
							</div>
						</div>

						<div class="deployment-progress">
							<div class="checks">
								{#each deployment.checks as check}
									<div class="check-item" class:active={check.status === 'running'}>
										<div class="check-icon {getStatusColor(check.status)}">
											{#if check.status === 'passed'}
												✓
											{:else if check.status === 'failed'}
												✕
											{:else if check.status === 'running'}
												⟳
											{:else}
												○
											{/if}
										</div>
										<span class="check-name">{check.name}</span>
										{#if check.duration}
											<span class="check-duration">{check.duration}s</span>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<div class="deployment-details">
							<div class="detail-row">
								<span>◆</span>
								<span>DEPLOYER: {deployment.deployedBy}</span>
								{#if deployment.approvedBy}
									<span class="separator">|</span>
									<span>APPROVER: {deployment.approvedBy}</span>
								{/if}
							</div>
							<div class="detail-row">
								<span>○</span>
								<span>STARTED: {deployment.startTime}</span>
								{#if deployment.duration}
									<span class="separator">|</span>
									<span>ELAPSED: {formatDuration(deployment.duration)}</span>
								{/if}
							</div>
							<button
								class="btn-text"
								on:click={() => toggleDeploymentDetails(deployment.id)}
							>
								{#if expandedDeployment === deployment.id}
									▲ COLLAPSE
								{:else}
									▼ EXPAND
								{/if}
							</button>
						</div>

						{#if expandedDeployment === deployment.id}
							<div class="deployment-expanded">
								<div class="changelog">
									<h4>CHANGES</h4>
									<ul>
										{#each deployment.changeLog as change}
											<li>{change}</li>
										{/each}
									</ul>
								</div>
								<div class="artifacts">
									<h4>ARTIFACTS</h4>
									<div class="artifact-list">
										{#each deployment.artifacts as artifact}
											<div class="artifact-item">
												<span>□</span>
												<span>{artifact.name}</span>
												<span class="size">{artifact.size}</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/if}

						<div class="deployment-actions">
							{#if deployment.status === 'in_progress'}
								<button class="btn-secondary" on:click={() => handlePauseDeployment(deployment.id)}>
									■ PAUSE
								</button>
							{:else if deployment.status === 'pending'}
								<button class="btn-primary" on:click={() => handleResumeDeployment(deployment.id)}>
									▶ START
								</button>
							{/if}
							{#if deployment.rollbackAvailable}
								<button class="btn-secondary danger" on:click={() => handleRollback(deployment.id)}>
									↶ ROLLBACK
								</button>
							{/if}
							<button class="btn-text" on:click={() => handleViewLogs(deployment.id)}>
								▣ LOGS
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{:else if activeTab === 'history'}
		<div class="history-section">
			<div class="history-filters">
				<select bind:value={selectedEnvironment}>
					<option value="all">ALL ENVIRONMENTS</option>
					<option value="production">PRODUCTION</option>
					<option value="staging">STAGING</option>
					<option value="development">DEVELOPMENT</option>
				</select>
				<select bind:value={selectedProject}>
					<option value="all">ALL PROJECTS</option>
					<option value="proj-1">SMART FARM MONITOR</option>
					<option value="proj-2">CROP ANALYTICS</option>
					<option value="proj-3">WEATHER SERVICE</option>
				</select>
				<select bind:value={selectedStatus}>
					<option value="all">ALL STATUS</option>
					<option value="completed">COMPLETED</option>
					<option value="failed">FAILED</option>
					<option value="rolled_back">ROLLED BACK</option>
				</select>
				<button class="btn-secondary">
					↓ EXPORT
				</button>
			</div>

			<div class="history-table">
				<table>
					<thead>
						<tr>
							<th>PROJECT</th>
							<th>VERSION</th>
							<th>ENVIRONMENT</th>
							<th>STATUS</th>
							<th>DEPLOYER</th>
							<th>START TIME</th>
							<th>DURATION</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{#each deploymentHistory as deployment}
							<tr class="{deployment.status}">
								<td>{deployment.projectName}</td>
								<td class="monospace">{deployment.version}</td>
								<td>
									<span class="environment-badge {deployment.environment}">
										{deployment.environment.toUpperCase()}
									</span>
								</td>
								<td>
									<span class="status-badge {getStatusColor(deployment.status)}">
										{deployment.status === 'completed' ? 'COMPLETED' :
										 deployment.status === 'failed' ? 'FAILED' : 'ROLLED BACK'}
									</span>
								</td>
								<td>{deployment.deployedBy}</td>
								<td>{deployment.startTime}</td>
								<td>{deployment.duration ? formatDuration(deployment.duration) : '-'}</td>
								<td>
									<div class="table-actions">
										<button class="btn-icon" on:click={() => handleViewLogs(deployment.id)}>
											○
										</button>
										{#if deployment.rollbackAvailable}
											<button class="btn-icon" on:click={() => handleRollback(deployment.id)}>
												↶
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else if activeTab === 'windows'}
		<div class="windows-section">
			<div class="windows-header">
				<h2>DEPLOYMENT WINDOW SCHEDULE</h2>
				<button class="btn-primary">
					+ CREATE NEW WINDOW
				</button>
			</div>

			<div class="windows-list">
				{#each deploymentWindows as window}
					<div class="window-card">
						<div class="window-header">
							<h3>{window.name}</h3>
							<span class="status-badge {window.status === 'active' ? 'success' : ''}">
								{window.status === 'scheduled' ? 'SCHEDULED' :
								 window.status === 'active' ? 'ACTIVE' :
								 window.status === 'completed' ? 'COMPLETED' : 'CANCELLED'}
							</span>
						</div>
						<div class="window-details">
							<div class="detail-row">
								<span>▤</span>
								<span>{window.startTime} ~ {window.endTime}</span>
							</div>
							<div class="detail-row">
								<span>▣</span>
								<span>ENVIRONMENTS: {window.environments.join(', ').toUpperCase()}</span>
							</div>
							<div class="detail-row">
								<span>□</span>
								<span>{window.projects.length} PROJECTS</span>
							</div>
							<div class="detail-row">
								<span>◆</span>
								<span>CREATOR: {window.createdBy}</span>
							</div>
						</div>
						<p class="window-description">{window.description}</p>
						<div class="window-actions">
							<button class="btn-secondary">EDIT</button>
							{#if window.status === 'scheduled'}
								<button class="btn-text danger">CANCEL</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if activeTab === 'rollback'}
		<div class="rollback-section">
			<div class="rollback-header">
				<h2>ROLLBACK MANAGEMENT</h2>
				<p>DEPLOYMENTS WITHIN LAST 30 DAYS CAN BE ROLLED BACK TO PREVIOUS VERSION</p>
			</div>

			<div class="rollback-list">
				{#each deploymentHistory.filter(d => d.rollbackAvailable) as deployment}
					<div class="rollback-card">
						<div class="rollback-info">
							<h3>{deployment.projectName}</h3>
							<div class="rollback-meta">
								<span class="version">CURRENT: {deployment.version}</span>
								<span class="separator">→</span>
								<span class="version">PREVIOUS: v2.4.0</span>
							</div>
							<div class="deployment-details">
								<span>{deployment.environment.toUpperCase()}</span>
								<span>{deployment.startTime}</span>
								<span>DEPLOYER: {deployment.deployedBy}</span>
							</div>
						</div>
						<div class="rollback-actions">
							<button class="btn-primary danger" on:click={() => handleRollback(deployment.id)}>
								↶ EXECUTE ROLLBACK
							</button>
							<button class="btn-secondary">
								ⓘ DETAILS
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="rollback-warning">
				<span class="warning-icon">▲</span>
				<div>
					<h4>ROLLBACK PRECAUTIONS</h4>
					<ul>
						<li>DATABASE MIGRATIONS ARE NOT AUTOMATICALLY ROLLED BACK</li>
						<li>BACKUP OF CURRENT VERSION AUTOMATICALLY CREATED BEFORE ROLLBACK</li>
						<li>SYSTEM STABILITY VERIFICATION REQUIRED AFTER ROLLBACK</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.deployments-container {
		padding: var(--space-6);
		max-width: 1400px;
		margin: 0 auto;
	}

	.deployments-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-6);
	}

	.deployments-header h1 {
		font-size: var(--text-24);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-2);
	}

	.deployments-header p {
		color: var(--muted);
		font-size: var(--text-12);
		letter-spacing: var(--tracking-wide);
	}

	.header-actions {
		display: flex;
		gap: var(--space-3);
	}

	.deployments-tabs {
		display: flex;
		gap: 0;
		border-bottom: var(--border-width) solid var(--fg);
		margin-bottom: var(--space-6);
	}

	.tab {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--text-12);
		font-weight: var(--weight-medium);
		letter-spacing: var(--tracking-wide);
		position: relative;
		transition: all 0.2s;
		border-right: var(--border-width) solid var(--border-color);
	}

	.tab:hover {
		background: var(--surface-1);
	}

	.tab.active {
		background: var(--fg);
		color: var(--bg);
	}

	.tab .badge {
		padding: 0 var(--space-2);
		background: var(--bg);
		color: var(--fg);
		font-size: var(--text-11);
		min-width: 20px;
		text-align: center;
		border: var(--border-width) solid var(--fg);
	}

	.tab.active .badge {
		background: var(--fg);
		color: var(--bg);
		border-color: var(--bg);
	}

	/* Environment Overview */
	.environments-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.environment-card {
		border: var(--border-width) solid var(--fg);
		padding: var(--space-4);
		background: var(--bg);
	}

	.environment-card.maintenance {
		opacity: 0.7;
		background: repeating-linear-gradient(
			-45deg,
			var(--bg),
			var(--bg) 10px,
			var(--surface-1) 10px,
			var(--surface-1) 20px
		);
	}

	.env-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.env-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.env-icon {
		font-size: var(--text-16);
	}

	.env-title h3 {
		font-size: var(--text-16);
		font-weight: var(--weight-semibold);
	}

	.env-type {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--fg);
		font-size: var(--text-11);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.env-type.production {
		background: var(--fg);
		color: var(--bg);
	}

	.env-type.staging {
		background: var(--bg);
		border-style: dashed;
	}

	.env-type.development {
		background: var(--surface-1);
	}

	.status-indicator {
		padding: var(--space-1) var(--space-3);
		border: var(--border-width) solid var(--fg);
		font-size: var(--text-12);
		font-weight: var(--weight-medium);
		letter-spacing: var(--tracking-wide);
	}

	.status-indicator.success {
		background: var(--fg);
		color: var(--bg);
	}

	.status-indicator.warning {
		background: var(--bg);
		border-width: 2px;
	}

	.status-indicator.error {
		background: var(--fg);
		color: var(--bg);
		text-decoration: line-through;
	}

	.env-info {
		margin-bottom: var(--space-4);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		border-bottom: var(--border-width) solid var(--divider);
		font-size: var(--text-12);
	}

	.info-row:last-child {
		border-bottom: none;
	}

	.info-row .label {
		color: var(--muted);
		letter-spacing: var(--tracking-wide);
	}

	.info-row .value {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: var(--weight-medium);
	}

	.info-row .value.highlight {
		background: var(--fg);
		color: var(--bg);
		padding: 0 var(--space-2);
	}

	.info-row .value.link {
		color: var(--fg);
		text-decoration: underline;
		cursor: pointer;
	}

	.env-resources {
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		background: var(--surface-1);
		border: var(--border-width) solid var(--border-color);
	}

	.env-resources h4 {
		font-size: var(--text-12);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-3);
	}

	.resources-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.resource {
		display: grid;
		grid-template-columns: 20px 80px 1fr 40px;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-12);
	}

	.progress-bar {
		height: 8px;
		background: var(--bg);
		border: var(--border-width) solid var(--fg);
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: var(--fg);
		transition: width 0.3s;
	}

	.percentage {
		text-align: right;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: var(--text-11);
		font-weight: var(--weight-semibold);
	}

	.instances {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-top: var(--space-2);
		border-top: var(--border-width) solid var(--border-color);
		font-size: var(--text-12);
	}

	.env-metrics {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.metric {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2);
		border: var(--border-width) solid var(--border-color);
		font-size: var(--text-12);
	}

	.metric-label {
		color: var(--muted);
		letter-spacing: var(--tracking-wide);
	}

	.metric-value {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: var(--weight-semibold);
	}

	.metric-value.warning {
		background: var(--fg);
		color: var(--bg);
		padding: 0 var(--space-2);
	}

	.env-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Active Deployments */
	.active-deployments {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.deployment-card {
		border: var(--border-width) solid var(--fg);
		padding: var(--space-4);
		background: var(--bg);
	}

	.deployment-card.in_progress {
		border-style: dashed;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
	}

	.deployment-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.deployment-info h3 {
		font-size: var(--text-16);
		font-weight: var(--weight-semibold);
		margin-bottom: var(--space-2);
	}

	.deployment-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-12);
		color: var(--muted);
	}

	.deployment-meta .version {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: var(--weight-semibold);
		color: var(--fg);
	}

	.deployment-meta .environment {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--fg);
		text-transform: uppercase;
		font-size: var(--text-11);
		letter-spacing: var(--tracking-wide);
	}

	.deployment-meta .branch,
	.deployment-meta .commit {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.deployment-status {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.status-badge {
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--fg);
		font-size: var(--text-12);
		font-weight: var(--weight-medium);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.status-badge.success {
		background: var(--fg);
		color: var(--bg);
	}

	.status-badge.warning {
		background: var(--bg);
		border-width: 2px;
	}

	.status-badge.error {
		background: var(--fg);
		color: var(--bg);
		text-decoration: line-through;
	}

	.deployment-progress {
		margin-bottom: var(--space-4);
	}

	.checks {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.check-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--border-color);
		font-size: var(--text-12);
	}

	.check-item.active {
		border-color: var(--fg);
		background: var(--surface-1);
	}

	.check-icon {
		display: flex;
		align-items: center;
	}

	.check-icon.success {
		color: var(--fg);
	}

	.check-icon.error {
		color: var(--muted);
	}

	.check-name {
		font-weight: var(--weight-medium);
	}

	.check-duration {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: var(--text-11);
		color: var(--muted);
	}

	.deployment-details {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		border-top: var(--border-width) solid var(--border-color);
		border-bottom: var(--border-width) solid var(--border-color);
		font-size: var(--text-12);
		color: var(--muted);
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.separator {
		color: var(--border-color);
	}

	.deployment-expanded {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		padding: var(--space-4) 0;
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.changelog h4,
	.artifacts h4 {
		font-size: var(--text-12);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-2);
	}

	.changelog ul {
		list-style: none;
		padding: 0;
	}

	.changelog li {
		padding: var(--space-2) 0;
		padding-left: var(--space-4);
		position: relative;
		font-size: var(--text-12);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.changelog li:before {
		content: "•";
		position: absolute;
		left: 0;
	}

	.artifact-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.artifact-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border: var(--border-width) solid var(--border-color);
		font-size: var(--text-12);
	}

	.artifact-item .size {
		margin-left: auto;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: var(--text-11);
		color: var(--muted);
	}

	.deployment-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	/* History Section */
	.history-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.history-filters {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border-width) solid var(--border-color);
	}

	.history-filters select {
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--fg);
		background: var(--bg);
		font-size: var(--text-12);
		cursor: pointer;
		font-family: inherit;
	}

	.history-table {
		overflow-x: auto;
	}

	.history-table table {
		width: 100%;
		border-collapse: collapse;
		border: var(--border-width) solid var(--fg);
	}

	.history-table th,
	.history-table td {
		padding: var(--space-3);
		text-align: left;
		border: var(--border-width) solid var(--fg);
		font-size: var(--text-12);
	}

	.history-table th {
		background: var(--fg);
		color: var(--bg);
		font-weight: var(--weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.history-table tr:hover {
		background: var(--surface-1);
	}

	.history-table .monospace {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.environment-badge {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--fg);
		font-size: var(--text-11);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.environment-badge.production {
		background: var(--fg);
		color: var(--bg);
	}

	.environment-badge.staging {
		border-style: dashed;
	}

	.table-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Windows Section */
	.windows-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.windows-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.windows-header h2 {
		font-size: var(--text-16);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.windows-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.window-card {
		border: var(--border-width) solid var(--fg);
		padding: var(--space-4);
	}

	.window-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-3);
	}

	.window-header h3 {
		font-size: var(--text-14);
		font-weight: var(--weight-semibold);
	}

	.window-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.window-description {
		font-size: var(--text-12);
		color: var(--muted);
		margin-bottom: var(--space-3);
	}

	.window-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Rollback Section */
	.rollback-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.rollback-header h2 {
		font-size: var(--text-16);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-2);
	}

	.rollback-header p {
		color: var(--muted);
		font-size: var(--text-12);
		letter-spacing: var(--tracking-wide);
	}

	.rollback-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.rollback-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border: var(--border-width) solid var(--fg);
	}

	.rollback-info h3 {
		font-size: var(--text-14);
		font-weight: var(--weight-semibold);
		margin-bottom: var(--space-2);
	}

	.rollback-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
		font-size: var(--text-12);
	}

	.rollback-meta .version {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: var(--weight-semibold);
	}

	.rollback-meta .separator {
		color: var(--muted);
	}

	.rollback-actions {
		display: flex;
		gap: var(--space-2);
	}

	.rollback-warning {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border-width) solid var(--fg);
		border-style: dashed;
	}

	.warning-icon {
		font-size: var(--text-20);
	}

	.rollback-warning h4 {
		font-size: var(--text-12);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-2);
	}

	.rollback-warning ul {
		list-style: none;
		padding: 0;
	}

	.rollback-warning li {
		padding: var(--space-1) 0;
		font-size: var(--text-12);
		padding-left: var(--space-4);
		position: relative;
	}

	.rollback-warning li:before {
		content: "—";
		position: absolute;
		left: 0;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		text-align: center;
		border: var(--border-width) dashed var(--border-color);
	}

	.empty-icon {
		font-size: var(--text-32);
		margin-bottom: var(--space-3);
	}

	.empty-state h3 {
		font-size: var(--text-16);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		margin: var(--space-3) 0 var(--space-2);
	}

	.empty-state p {
		color: var(--muted);
		font-size: var(--text-12);
		letter-spacing: var(--tracking-wide);
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary,
	.btn-text,
	.btn-icon {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--fg);
		background: var(--bg);
		cursor: pointer;
		font-size: var(--text-12);
		font-weight: var(--weight-medium);
		letter-spacing: var(--tracking-wide);
		transition: all 0.2s;
		font-family: inherit;
	}

	.btn-primary {
		background: var(--fg);
		color: var(--bg);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-secondary:hover {
		background: var(--surface-1);
	}

	.btn-text {
		border: none;
		padding: var(--space-1) var(--space-2);
	}

	.btn-text:hover {
		background: var(--surface-1);
	}

	.btn-text.danger,
	.btn-primary.danger,
	.btn-secondary.danger {
		border-color: var(--fg);
	}

	.btn-primary.danger {
		background: var(--fg);
		color: var(--bg);
	}

	.btn-icon {
		padding: var(--space-2);
	}

	/* Animations */
	.spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Utilities */
	.monospace {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}
</style>
