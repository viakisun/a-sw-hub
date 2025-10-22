<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Rocket,
		Server,
		GitBranch,
		Clock,
		CheckCircle,
		XCircle,
		AlertCircle,
		RefreshCw,
		Play,
		Pause,
		RotateCcw,
		ChevronDown,
		ChevronUp,
		Calendar,
		User,
		Package,
		Database,
		Shield,
		Zap,
		AlertTriangle,
		Settings,
		MoreVertical,
		Filter,
		Download,
		Eye,
		Terminal,
		Activity,
		Globe,
		Cloud,
		HardDrive,
		Cpu,
		BarChart,
		TrendingUp,
		TrendingDown,
		Info
	} from 'lucide-svelte';

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
			deployedBy: '김개발',
			startTime: '2024-03-15 17:30:00',
			duration: 320,
			commit: 'abc123def',
			branch: 'release/2.6.0',
			changeLog: [
				'센서 데이터 수집 개선',
				'대시보드 UI 업데이트',
				'버그 수정: 알림 중복 발송'
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
			deployedBy: '박운영',
			startTime: '2024-03-16 02:00:00',
			commit: 'def456ghi',
			branch: 'main',
			changeLog: [
				'분석 알고리즘 성능 개선',
				'리포트 생성 속도 향상'
			],
			approvedBy: '이승인',
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
			deployedBy: '김개발',
			startTime: '2024-03-15 10:00:00',
			endTime: '2024-03-15 10:30:00',
			duration: 1800,
			commit: 'xyz789abc',
			branch: 'main',
			changeLog: [
				'새로운 센서 지원 추가',
				'알림 시스템 개선'
			],
			approvedBy: '이승인',
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
			deployedBy: '박운영',
			startTime: '2024-03-15 08:00:00',
			endTime: '2024-03-15 08:15:00',
			duration: 900,
			commit: 'fail123xyz',
			branch: 'hotfix/memory-leak',
			changeLog: [
				'메모리 누수 수정 시도'
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
			name: '정기 배포 - 3월 3주차',
			startTime: '2024-03-16 02:00',
			endTime: '2024-03-16 06:00',
			environments: ['production'],
			projects: ['proj-1', 'proj-2', 'proj-5'],
			status: 'scheduled',
			createdBy: '이승인',
			description: '월간 정기 업데이트 배포'
		},
		{
			id: 'window-2',
			name: '긴급 패치',
			startTime: '2024-03-15 23:00',
			endTime: '2024-03-15 23:30',
			environments: ['production', 'staging'],
			projects: ['proj-3'],
			status: 'scheduled',
			createdBy: '김긴급',
			description: '보안 패치 긴급 배포'
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
				return Rocket;
			case 'staging':
				return Package;
			case 'development':
				return Code;
			default:
				return Server;
		}
	}

	function handleDeploy(envId: string) {
		alert(`배포 시작: ${envId}`);
	}

	function handleRollback(deployId: string) {
		if (confirm('정말로 이전 버전으로 롤백하시겠습니까?')) {
			alert(`롤백 시작: ${deployId}`);
		}
	}

	function handlePauseDeployment(deployId: string) {
		alert(`배포 일시 중지: ${deployId}`);
	}

	function handleResumeDeployment(deployId: string) {
		alert(`배포 재개: ${deployId}`);
	}

	function handleViewLogs(deployId: string) {
		alert(`로그 보기: ${deployId}`);
	}

	function toggleDeploymentDetails(deployId: string) {
		expandedDeployment = expandedDeployment === deployId ? null : deployId;
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}분 ${remainingSeconds}초`;
	}

	onMount(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(() => {
				// Refresh data
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
			<h1>배포 관리</h1>
			<p>환경별 배포 상태 및 배포 이력을 관리합니다</p>
		</div>
		<div class="header-actions">
			<button class="btn-secondary">
				<Calendar size={16} />
				배포 윈도우
			</button>
			<button class="btn-primary">
				<Rocket size={16} />
				새 배포
			</button>
		</div>
	</div>

	<div class="deployments-tabs">
		<button
			class="tab"
			class:active={activeTab === 'overview'}
			on:click={() => activeTab = 'overview'}
		>
			<Globe size={16} />
			환경 현황
		</button>
		<button
			class="tab"
			class:active={activeTab === 'active'}
			on:click={() => activeTab = 'active'}
		>
			<Activity size={16} />
			진행 중인 배포
			{#if activeDeployments.length > 0}
				<span class="badge">{activeDeployments.length}</span>
			{/if}
		</button>
		<button
			class="tab"
			class:active={activeTab === 'history'}
			on:click={() => activeTab = 'history'}
		>
			<Clock size={16} />
			배포 이력
		</button>
		<button
			class="tab"
			class:active={activeTab === 'windows'}
			on:click={() => activeTab = 'windows'}
		>
			<Calendar size={16} />
			배포 윈도우
		</button>
		<button
			class="tab"
			class:active={activeTab === 'rollback'}
			on:click={() => activeTab = 'rollback'}
		>
			<RotateCcw size={16} />
			롤백 관리
		</button>
	</div>

	{#if activeTab === 'overview'}
		<div class="environments-grid">
			{#each environments as env}
				<div class="environment-card" class:maintenance={env.status === 'maintenance'}>
					<div class="env-header">
						<div class="env-title">
							<svelte:component this={getEnvironmentIcon(env.type)} size={20} />
							<h3>{env.name}</h3>
							<span class="env-type {env.type}">{env.type}</span>
						</div>
						<span class="status-indicator {getStatusColor(env.status)}">
							{env.status === 'healthy' ? '정상' :
							 env.status === 'degraded' ? '저하' :
							 env.status === 'down' ? '중단' : '점검중'}
						</span>
					</div>

					<div class="env-info">
						<div class="info-row">
							<span class="label">현재 버전:</span>
							<span class="value">{env.version}</span>
						</div>
						<div class="info-row">
							<span class="label">마지막 배포:</span>
							<span class="value">{env.lastDeployment}</span>
						</div>
						{#if env.nextDeployment}
							<div class="info-row">
								<span class="label">예정 배포:</span>
								<span class="value highlight">{env.nextDeployment}</span>
							</div>
						{/if}
						<div class="info-row">
							<span class="label">URL:</span>
							<a href={env.url} class="value link" target="_blank">{env.url}</a>
						</div>
						<div class="info-row">
							<span class="label">리전:</span>
							<span class="value">{env.region}</span>
						</div>
					</div>

					<div class="env-resources">
						<h4>리소스 사용량</h4>
						<div class="resources-grid">
							<div class="resource">
								<Cpu size={14} />
								<span>CPU</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.cpu}%"></div>
								</div>
								<span class="percentage">{env.resources.cpu}%</span>
							</div>
							<div class="resource">
								<HardDrive size={14} />
								<span>메모리</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.memory}%"></div>
								</div>
								<span class="percentage">{env.resources.memory}%</span>
							</div>
							<div class="resource">
								<Database size={14} />
								<span>스토리지</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {env.resources.storage}%"></div>
								</div>
								<span class="percentage">{env.resources.storage}%</span>
							</div>
						</div>
						<div class="instances">
							<Server size={14} />
							<span>인스턴스: {env.resources.instances}개 실행 중</span>
						</div>
					</div>

					<div class="env-metrics">
						<div class="metric">
							<span class="metric-label">가동률</span>
							<span class="metric-value">{env.metrics.uptime}%</span>
						</div>
						<div class="metric">
							<span class="metric-label">응답 시간</span>
							<span class="metric-value">{env.metrics.responseTime}ms</span>
						</div>
						<div class="metric">
							<span class="metric-label">오류율</span>
							<span class="metric-value {env.metrics.errorRate > 1 ? 'warning' : ''}">{env.metrics.errorRate}%</span>
						</div>
						<div class="metric">
							<span class="metric-label">처리량</span>
							<span class="metric-value">{env.metrics.throughput.toLocaleString()}/m</span>
						</div>
					</div>

					<div class="env-actions">
						<button class="btn-primary" on:click={() => handleDeploy(env.id)}>
							<Rocket size={14} />
							배포
						</button>
						<button class="btn-secondary">
							<Eye size={14} />
							모니터링
						</button>
						<button class="btn-icon">
							<Settings size={14} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 'active'}
		<div class="active-deployments">
			{#if activeDeployments.length === 0}
				<div class="empty-state">
					<Activity size={48} />
					<h3>진행 중인 배포가 없습니다</h3>
					<p>현재 모든 배포가 완료되었습니다</p>
				</div>
			{:else}
				{#each activeDeployments as deployment}
					<div class="deployment-card {deployment.status}">
						<div class="deployment-header">
							<div class="deployment-info">
								<h3>{deployment.projectName}</h3>
								<div class="deployment-meta">
									<span class="version">{deployment.version}</span>
									<span class="environment {deployment.environment}">{deployment.environment}</span>
									<span class="branch">
										<GitBranch size={14} />
										{deployment.branch}
									</span>
									<span class="commit">{deployment.commit}</span>
								</div>
							</div>
							<div class="deployment-status">
								<span class="status-badge {getStatusColor(deployment.status)}">
									{deployment.status === 'in_progress' ? '배포 중' :
									 deployment.status === 'pending' ? '대기 중' :
									 deployment.status === 'completed' ? '완료' :
									 deployment.status === 'failed' ? '실패' : '롤백됨'}
								</span>
								{#if deployment.status === 'in_progress'}
									<RefreshCw size={16} class="spin" />
								{/if}
							</div>
						</div>

						<div class="deployment-progress">
							<div class="checks">
								{#each deployment.checks as check}
									<div class="check-item" class:active={check.status === 'running'}>
										<div class="check-icon {getStatusColor(check.status)}">
											{#if check.status === 'passed'}
												<CheckCircle size={16} />
											{:else if check.status === 'failed'}
												<XCircle size={16} />
											{:else if check.status === 'running'}
												<RefreshCw size={16} class="spin" />
											{:else}
												<Clock size={16} />
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
								<User size={14} />
								<span>배포자: {deployment.deployedBy}</span>
								{#if deployment.approvedBy}
									<span class="separator">|</span>
									<span>승인자: {deployment.approvedBy}</span>
								{/if}
							</div>
							<div class="detail-row">
								<Clock size={14} />
								<span>시작: {deployment.startTime}</span>
								{#if deployment.duration}
									<span class="separator">|</span>
									<span>경과: {formatDuration(deployment.duration)}</span>
								{/if}
							</div>
							<button
								class="btn-text"
								on:click={() => toggleDeploymentDetails(deployment.id)}
							>
								{#if expandedDeployment === deployment.id}
									<ChevronUp size={14} />
									간략히
								{:else}
									<ChevronDown size={14} />
									자세히
								{/if}
							</button>
						</div>

						{#if expandedDeployment === deployment.id}
							<div class="deployment-expanded">
								<div class="changelog">
									<h4>변경 사항</h4>
									<ul>
										{#each deployment.changeLog as change}
											<li>{change}</li>
										{/each}
									</ul>
								</div>
								<div class="artifacts">
									<h4>아티팩트</h4>
									<div class="artifact-list">
										{#each deployment.artifacts as artifact}
											<div class="artifact-item">
												<Package size={14} />
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
									<Pause size={14} />
									일시 중지
								</button>
							{:else if deployment.status === 'pending'}
								<button class="btn-primary" on:click={() => handleResumeDeployment(deployment.id)}>
									<Play size={14} />
									시작
								</button>
							{/if}
							{#if deployment.rollbackAvailable}
								<button class="btn-secondary danger" on:click={() => handleRollback(deployment.id)}>
									<RotateCcw size={14} />
									롤백
								</button>
							{/if}
							<button class="btn-text" on:click={() => handleViewLogs(deployment.id)}>
								<Terminal size={14} />
								로그
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
					<option value="all">모든 환경</option>
					<option value="production">Production</option>
					<option value="staging">Staging</option>
					<option value="development">Development</option>
				</select>
				<select bind:value={selectedProject}>
					<option value="all">모든 프로젝트</option>
					<option value="proj-1">Smart Farm Monitor</option>
					<option value="proj-2">Crop Analytics</option>
					<option value="proj-3">Weather Service</option>
				</select>
				<select bind:value={selectedStatus}>
					<option value="all">모든 상태</option>
					<option value="completed">완료</option>
					<option value="failed">실패</option>
					<option value="rolled_back">롤백됨</option>
				</select>
				<button class="btn-secondary">
					<Download size={16} />
					내보내기
				</button>
			</div>

			<div class="history-table">
				<table>
					<thead>
						<tr>
							<th>프로젝트</th>
							<th>버전</th>
							<th>환경</th>
							<th>상태</th>
							<th>배포자</th>
							<th>시작 시간</th>
							<th>소요 시간</th>
							<th>작업</th>
						</tr>
					</thead>
					<tbody>
						{#each deploymentHistory as deployment}
							<tr class="{deployment.status}">
								<td>{deployment.projectName}</td>
								<td class="monospace">{deployment.version}</td>
								<td>
									<span class="environment-badge {deployment.environment}">
										{deployment.environment}
									</span>
								</td>
								<td>
									<span class="status-badge {getStatusColor(deployment.status)}">
										{deployment.status === 'completed' ? '완료' :
										 deployment.status === 'failed' ? '실패' : '롤백됨'}
									</span>
								</td>
								<td>{deployment.deployedBy}</td>
								<td>{deployment.startTime}</td>
								<td>{deployment.duration ? formatDuration(deployment.duration) : '-'}</td>
								<td>
									<div class="table-actions">
										<button class="btn-icon" on:click={() => handleViewLogs(deployment.id)}>
											<Eye size={14} />
										</button>
										{#if deployment.rollbackAvailable}
											<button class="btn-icon" on:click={() => handleRollback(deployment.id)}>
												<RotateCcw size={14} />
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
				<h2>배포 윈도우 일정</h2>
				<button class="btn-primary">
					<Plus size={16} />
					새 윈도우 생성
				</button>
			</div>

			<div class="windows-list">
				{#each deploymentWindows as window}
					<div class="window-card">
						<div class="window-header">
							<h3>{window.name}</h3>
							<span class="status-badge {window.status === 'active' ? 'success' : ''}">
								{window.status === 'scheduled' ? '예정' :
								 window.status === 'active' ? '진행 중' :
								 window.status === 'completed' ? '완료' : '취소됨'}
							</span>
						</div>
						<div class="window-details">
							<div class="detail-row">
								<Calendar size={14} />
								<span>{window.startTime} ~ {window.endTime}</span>
							</div>
							<div class="detail-row">
								<Server size={14} />
								<span>환경: {window.environments.join(', ')}</span>
							</div>
							<div class="detail-row">
								<Package size={14} />
								<span>{window.projects.length}개 프로젝트</span>
							</div>
							<div class="detail-row">
								<User size={14} />
								<span>생성자: {window.createdBy}</span>
							</div>
						</div>
						<p class="window-description">{window.description}</p>
						<div class="window-actions">
							<button class="btn-secondary">편집</button>
							{#if window.status === 'scheduled'}
								<button class="btn-text danger">취소</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if activeTab === 'rollback'}
		<div class="rollback-section">
			<div class="rollback-header">
				<h2>롤백 가능한 배포</h2>
				<p>최근 30일 이내의 배포를 이전 버전으로 롤백할 수 있습니다</p>
			</div>

			<div class="rollback-list">
				{#each deploymentHistory.filter(d => d.rollbackAvailable) as deployment}
					<div class="rollback-card">
						<div class="rollback-info">
							<h3>{deployment.projectName}</h3>
							<div class="rollback-meta">
								<span class="version">현재: {deployment.version}</span>
								<span class="separator">→</span>
								<span class="version">이전: v2.4.0</span>
							</div>
							<div class="deployment-details">
								<span>{deployment.environment}</span>
								<span>{deployment.startTime}</span>
								<span>배포자: {deployment.deployedBy}</span>
							</div>
						</div>
						<div class="rollback-actions">
							<button class="btn-primary danger" on:click={() => handleRollback(deployment.id)}>
								<RotateCcw size={16} />
								롤백 실행
							</button>
							<button class="btn-secondary">
								<Info size={16} />
								상세 정보
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="rollback-warning">
				<AlertTriangle size={20} />
				<div>
					<h4>롤백 시 주의사항</h4>
					<ul>
						<li>데이터베이스 마이그레이션은 자동으로 롤백되지 않습니다</li>
						<li>롤백 전 현재 버전의 백업이 자동으로 생성됩니다</li>
						<li>롤백 후 시스템 안정성 확인이 필요합니다</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(:root) {
		--spacing-1: 0.25rem;
		--spacing-2: 0.5rem;
		--spacing-3: 0.75rem;
		--spacing-4: 1rem;
		--spacing-6: 1.5rem;
		--spacing-8: 2rem;
		--text-xs: 0.75rem;
		--text-sm: 0.875rem;
		--text-md: 1rem;
		--text-lg: 1.125rem;
		--text-xl: 1.25rem;
		--text-2xl: 1.5rem;
	}

	.deployments-container {
		padding: var(--spacing-6);
		max-width: 1400px;
		margin: 0 auto;
	}

	.deployments-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-6);
	}

	.deployments-header h1 {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-bottom: var(--spacing-2);
	}

	.deployments-header p {
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	.header-actions {
		display: flex;
		gap: var(--spacing-3);
	}

	.deployments-tabs {
		display: flex;
		gap: var(--spacing-1);
		border-bottom: 2px solid var(--fg);
		margin-bottom: var(--spacing-6);
	}

	.tab {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-4);
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: 500;
		position: relative;
		transition: all 0.2s;
	}

	.tab:hover {
		background: var(--bg-secondary);
	}

	.tab.active {
		background: var(--fg);
		color: var(--bg);
	}

	.tab .badge {
		padding: 0 var(--spacing-2);
		background: var(--bg);
		color: var(--fg);
		font-size: var(--text-xs);
		min-width: 20px;
		text-align: center;
		border: 1px solid var(--fg);
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
		gap: var(--spacing-4);
	}

	.environment-card {
		border: 2px solid var(--fg);
		padding: var(--spacing-4);
		background: var(--bg);
	}

	.environment-card.maintenance {
		opacity: 0.7;
		background: repeating-linear-gradient(
			-45deg,
			var(--bg),
			var(--bg) 10px,
			var(--bg-secondary) 10px,
			var(--bg-secondary) 20px
		);
	}

	.env-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-4);
		padding-bottom: var(--spacing-3);
		border-bottom: 1px solid var(--border);
	}

	.env-title {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.env-title h3 {
		font-size: var(--text-lg);
		font-weight: 600;
	}

	.env-type {
		padding: var(--spacing-1) var(--spacing-2);
		border: 1px solid var(--fg);
		font-size: var(--text-xs);
		text-transform: uppercase;
	}

	.env-type.production {
		background: var(--fg);
		color: var(--bg);
	}

	.env-type.staging {
		background: var(--bg);
		border: 1px dashed var(--fg);
	}

	.env-type.development {
		background: var(--bg-secondary);
	}

	.status-indicator {
		padding: var(--spacing-1) var(--spacing-3);
		border: 1px solid var(--fg);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.status-indicator.success {
		background: var(--fg);
		color: var(--bg);
	}

	.status-indicator.warning {
		background: var(--bg);
		border: 2px solid var(--fg);
	}

	.status-indicator.error {
		background: var(--fg);
		color: var(--bg);
		text-decoration: line-through;
	}

	.env-info {
		margin-bottom: var(--spacing-4);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-2) 0;
		border-bottom: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.info-row:last-child {
		border-bottom: none;
	}

	.info-row .label {
		color: var(--text-secondary);
	}

	.info-row .value {
		font-family: var(--font-mono);
		font-weight: 500;
	}

	.info-row .value.highlight {
		background: var(--fg);
		color: var(--bg);
		padding: 0 var(--spacing-2);
	}

	.info-row .value.link {
		color: var(--fg);
		text-decoration: underline;
		cursor: pointer;
	}

	.env-resources {
		margin-bottom: var(--spacing-4);
		padding: var(--spacing-3);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
	}

	.env-resources h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--spacing-3);
	}

	.resources-grid {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-3);
	}

	.resource {
		display: grid;
		grid-template-columns: 20px 80px 1fr 40px;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--text-sm);
	}

	.progress-bar {
		height: 8px;
		background: var(--bg);
		border: 1px solid var(--fg);
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: var(--fg);
		transition: width 0.3s;
	}

	.percentage {
		text-align: right;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		font-weight: 600;
	}

	.instances {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding-top: var(--spacing-2);
		border-top: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.env-metrics {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-4);
	}

	.metric {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-2);
		border: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.metric-label {
		color: var(--text-secondary);
	}

	.metric-value {
		font-family: var(--font-mono);
		font-weight: 600;
	}

	.metric-value.warning {
		background: var(--fg);
		color: var(--bg);
		padding: 0 var(--spacing-2);
	}

	.env-actions {
		display: flex;
		gap: var(--spacing-2);
	}

	/* Active Deployments */
	.active-deployments {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.deployment-card {
		border: 2px solid var(--fg);
		padding: var(--spacing-4);
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
		margin-bottom: var(--spacing-4);
		padding-bottom: var(--spacing-3);
		border-bottom: 1px solid var(--border);
	}

	.deployment-info h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--spacing-2);
	}

	.deployment-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.deployment-meta .version {
		font-family: var(--font-mono);
		font-weight: 600;
		color: var(--fg);
	}

	.deployment-meta .environment {
		padding: var(--spacing-1) var(--spacing-2);
		border: 1px solid var(--fg);
		text-transform: uppercase;
		font-size: var(--text-xs);
	}

	.deployment-meta .branch,
	.deployment-meta .commit {
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
		font-family: var(--font-mono);
	}

	.deployment-status {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.status-badge {
		padding: var(--spacing-2) var(--spacing-3);
		border: 1px solid var(--fg);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
	}

	.status-badge.success {
		background: var(--fg);
		color: var(--bg);
	}

	.status-badge.warning {
		background: var(--bg);
		border: 2px solid var(--fg);
	}

	.status-badge.error {
		background: var(--fg);
		color: var(--bg);
		text-decoration: line-through;
	}

	.deployment-progress {
		margin-bottom: var(--spacing-4);
	}

	.checks {
		display: flex;
		gap: var(--spacing-2);
		flex-wrap: wrap;
	}

	.check-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-3);
		border: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.check-item.active {
		border-color: var(--fg);
		background: var(--bg-secondary);
	}

	.check-icon {
		display: flex;
		align-items: center;
	}

	.check-icon.success {
		color: var(--success);
	}

	.check-icon.error {
		color: var(--error);
	}

	.check-name {
		font-weight: 500;
	}

	.check-duration {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}

	.deployment-details {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		padding: var(--spacing-3) 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.separator {
		color: var(--border);
	}

	.deployment-expanded {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-4);
		padding: var(--spacing-4) 0;
		border-bottom: 1px solid var(--border);
	}

	.changelog h4,
	.artifacts h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--spacing-2);
	}

	.changelog ul {
		list-style: none;
		padding: 0;
	}

	.changelog li {
		padding: var(--spacing-2) 0;
		padding-left: var(--spacing-4);
		position: relative;
		font-size: var(--text-sm);
		border-bottom: 1px solid var(--border);
	}

	.changelog li:before {
		content: "•";
		position: absolute;
		left: 0;
	}

	.artifact-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.artifact-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2);
		border: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.artifact-item .size {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}

	.deployment-actions {
		display: flex;
		gap: var(--spacing-2);
		margin-top: var(--spacing-4);
	}

	/* History Section */
	.history-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.history-filters {
		display: flex;
		gap: var(--spacing-3);
		padding: var(--spacing-4);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
	}

	.history-filters select {
		padding: var(--spacing-2) var(--spacing-3);
		border: 1px solid var(--fg);
		background: var(--bg);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.history-table {
		overflow-x: auto;
	}

	.history-table table {
		width: 100%;
		border-collapse: collapse;
		border: 2px solid var(--fg);
	}

	.history-table th,
	.history-table td {
		padding: var(--spacing-3);
		text-align: left;
		border: 1px solid var(--fg);
		font-size: var(--text-sm);
	}

	.history-table th {
		background: var(--fg);
		color: var(--bg);
		font-weight: 600;
		text-transform: uppercase;
	}

	.history-table tr:hover {
		background: var(--bg-secondary);
	}

	.history-table .monospace {
		font-family: var(--font-mono);
	}

	.environment-badge {
		padding: var(--spacing-1) var(--spacing-2);
		border: 1px solid var(--fg);
		font-size: var(--text-xs);
		text-transform: uppercase;
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
		gap: var(--spacing-2);
	}

	/* Windows Section */
	.windows-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.windows-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.windows-header h2 {
		font-size: var(--text-xl);
		font-weight: 700;
	}

	.windows-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-4);
	}

	.window-card {
		border: 2px solid var(--fg);
		padding: var(--spacing-4);
	}

	.window-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-3);
	}

	.window-header h3 {
		font-size: var(--text-lg);
		font-weight: 600;
	}

	.window-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-3);
		padding-bottom: var(--spacing-3);
		border-bottom: 1px solid var(--border);
	}

	.window-description {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin-bottom: var(--spacing-3);
	}

	.window-actions {
		display: flex;
		gap: var(--spacing-2);
	}

	/* Rollback Section */
	.rollback-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.rollback-header h2 {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--spacing-2);
	}

	.rollback-header p {
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	.rollback-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.rollback-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4);
		border: 2px solid var(--fg);
	}

	.rollback-info h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--spacing-2);
	}

	.rollback-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-2);
		font-size: var(--text-sm);
	}

	.rollback-meta .version {
		font-family: var(--font-mono);
		font-weight: 600;
	}

	.rollback-meta .separator {
		color: var(--text-secondary);
	}

	.rollback-actions {
		display: flex;
		gap: var(--spacing-2);
	}

	.rollback-warning {
		display: flex;
		gap: var(--spacing-3);
		padding: var(--spacing-4);
		background: var(--bg-secondary);
		border: 2px solid var(--fg);
		border-style: dashed;
	}

	.rollback-warning h4 {
		font-size: var(--text-md);
		font-weight: 600;
		margin-bottom: var(--spacing-2);
	}

	.rollback-warning ul {
		list-style: none;
		padding: 0;
	}

	.rollback-warning li {
		padding: var(--spacing-1) 0;
		font-size: var(--text-sm);
		padding-left: var(--spacing-4);
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
		padding: var(--spacing-8);
		text-align: center;
		border: 2px dashed var(--border);
	}

	.empty-state h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		margin: var(--spacing-3) 0 var(--spacing-2);
	}

	.empty-state p {
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary,
	.btn-text,
	.btn-icon {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-3);
		border: 1px solid var(--fg);
		background: var(--bg);
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--fg);
		color: var(--bg);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-secondary:hover {
		background: var(--bg-secondary);
	}

	.btn-text {
		border: none;
		padding: var(--spacing-1) var(--spacing-2);
	}

	.btn-text:hover {
		background: var(--bg-secondary);
	}

	.btn-text.danger,
	.btn-primary.danger,
	.btn-secondary.danger {
		color: var(--error);
		border-color: var(--error);
	}

	.btn-primary.danger {
		background: var(--error);
		color: var(--bg);
		border-color: var(--error);
	}

	.btn-icon {
		padding: var(--spacing-2);
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
		font-family: var(--font-mono);
	}

	.success { color: var(--success); }
	.warning { color: var(--warning); }
	.error { color: var(--error); }
	.danger { color: var(--error); }
</style>