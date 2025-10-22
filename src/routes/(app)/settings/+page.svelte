<script lang="ts">
	import { onMount } from 'svelte';
	import {
		User,
		Shield,
		Key,
		Bell,
		Globe,
		Code,
		Package,
		Moon,
		Monitor,
		GitBranch,
		Database,
		Zap,
		Mail,
		Phone,
		MapPin,
		Calendar,
		Clock,
		Download,
		Trash2,
		Save,
		RefreshCw,
		AlertTriangle,
		Check,
		X,
		ChevronRight,
		ExternalLink,
		Copy,
		Eye,
		EyeOff,
		Plus,
		Minus
	} from 'lucide-svelte';

	let activeTab = 'profile';
	let isDirty = false;
	let isSaving = false;
	let showPassword = false;
	let showNewPassword = false;
	let showApiKey = false;
	let selectedTheme = 'light';
	let selectedLanguage = 'ko';
	let selectedTimezone = 'Asia/Seoul';

	// Profile data
	let profile = {
		username: 'admin',
		email: 'admin@asw-hub.local',
		fullName: '관리자',
		department: 'IT Operations',
		role: 'System Administrator',
		phone: '+82-10-1234-5678',
		location: 'Seoul, South Korea',
		bio: 'Agricultural software platform administrator',
		avatar: '',
		joinDate: '2024-01-15'
	};

	// Password change
	let passwordForm = {
		current: '',
		new: '',
		confirm: ''
	};

	// Notifications
	let notifications = {
		email: {
			builds: true,
			approvals: true,
			deployments: true,
			security: true,
			updates: false
		},
		push: {
			builds: false,
			approvals: true,
			deployments: true,
			security: true,
			updates: false
		},
		slack: {
			builds: true,
			approvals: true,
			deployments: true,
			security: true,
			updates: false
		}
	};

	// Preferences
	let preferences = {
		theme: 'light',
		language: 'ko',
		timezone: 'Asia/Seoul',
		dateFormat: 'YYYY-MM-DD',
		timeFormat: '24h',
		firstDayOfWeek: 'monday',
		pageSize: 20,
		compactMode: false,
		showLineNumbers: true,
		autoRefresh: true,
		refreshInterval: 30
	};

	// Security
	let security = {
		twoFactorEnabled: false,
		sessionTimeout: 30,
		ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
		apiKeys: [
			{
				id: '1',
				name: 'CI/CD Pipeline',
				key: 'ask_1234567890abcdef',
				created: '2024-02-01',
				lastUsed: '2024-03-15',
				permissions: ['read', 'build', 'deploy']
			},
			{
				id: '2',
				name: 'Monitoring System',
				key: 'ask_fedcba0987654321',
				created: '2024-02-15',
				lastUsed: '2024-03-14',
				permissions: ['read']
			}
		],
		sessions: [
			{
				id: '1',
				device: 'Chrome on Windows',
				ip: '192.168.1.100',
				location: 'Seoul, KR',
				lastActive: '2 minutes ago',
				current: true
			},
			{
				id: '2',
				device: 'Safari on iPhone',
				ip: '192.168.1.150',
				location: 'Seoul, KR',
				lastActive: '1 hour ago',
				current: false
			}
		]
	};

	// Integrations
	let integrations = [
		{
			id: 'github',
			name: 'GitHub',
			icon: GitBranch,
			connected: true,
			username: 'admin-asw',
			lastSync: '2024-03-15 10:30'
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			icon: GitBranch,
			connected: false,
			username: '',
			lastSync: ''
		},
		{
			id: 'jenkins',
			name: 'Jenkins',
			icon: Package,
			connected: true,
			username: 'admin',
			lastSync: '2024-03-15 11:00'
		},
		{
			id: 'slack',
			name: 'Slack',
			icon: Bell,
			connected: true,
			username: 'admin@asw.slack.com',
			lastSync: '2024-03-15 12:00'
		},
		{
			id: 'jira',
			name: 'Jira',
			icon: Database,
			connected: false,
			username: '',
			lastSync: ''
		}
	];

	// Data & Privacy
	let dataExportRequests = [
		{
			id: '1',
			date: '2024-03-01',
			status: 'completed',
			size: '125 MB',
			url: '/exports/data-2024-03-01.zip'
		},
		{
			id: '2',
			date: '2024-02-01',
			status: 'completed',
			size: '98 MB',
			url: '/exports/data-2024-02-01.zip'
		}
	];

	function handleSaveProfile() {
		isDirty = false;
		isSaving = true;
		setTimeout(() => {
			isSaving = false;
			alert('프로필이 저장되었습니다');
		}, 1000);
	}

	function handleChangePassword() {
		if (passwordForm.new !== passwordForm.confirm) {
			alert('새 비밀번호가 일치하지 않습니다');
			return;
		}
		alert('비밀번호가 변경되었습니다');
		passwordForm = { current: '', new: '', confirm: '' };
	}

	function handleGenerateApiKey() {
		const newKey = {
			id: Date.now().toString(),
			name: 'New API Key',
			key: 'ask_' + Math.random().toString(36).substring(2, 18),
			created: new Date().toISOString().split('T')[0],
			lastUsed: 'Never',
			permissions: ['read']
		};
		security.apiKeys = [...security.apiKeys, newKey];
	}

	function handleRevokeApiKey(id: string) {
		if (confirm('이 API 키를 취소하시겠습니까?')) {
			security.apiKeys = security.apiKeys.filter(k => k.id !== id);
		}
	}

	function handleTerminateSession(id: string) {
		if (confirm('이 세션을 종료하시겠습니까?')) {
			security.sessions = security.sessions.filter(s => s.id !== id);
		}
	}

	function handleToggleIntegration(id: string) {
		integrations = integrations.map(i => {
			if (i.id === id) {
				return { ...i, connected: !i.connected };
			}
			return i;
		});
	}

	function handleExportData() {
		const newExport = {
			id: Date.now().toString(),
			date: new Date().toISOString().split('T')[0],
			status: 'processing',
			size: 'Calculating...',
			url: ''
		};
		dataExportRequests = [newExport, ...dataExportRequests];

		setTimeout(() => {
			dataExportRequests = dataExportRequests.map(r => {
				if (r.id === newExport.id) {
					return {
						...r,
						status: 'completed',
						size: '150 MB',
						url: `/exports/data-${r.date}.zip`
					};
				}
				return r;
			});
		}, 3000);
	}

	function handleDeleteAccount() {
		if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
			alert('계정 삭제가 요청되었습니다. 관리자가 검토 후 처리됩니다.');
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		alert('클립보드에 복사되었습니다');
	}
</script>

<div class="settings-container">
	<div class="settings-header">
		<h1>설정</h1>
		<p>계정 설정 및 환경 설정을 관리합니다</p>
	</div>

	<div class="settings-layout">
		<aside class="settings-sidebar">
			<nav class="settings-nav">
				<button
					class="nav-item"
					class:active={activeTab === 'profile'}
					on:click={() => activeTab = 'profile'}
				>
					<User size={20} />
					<span>프로필</span>
					<ChevronRight size={16} />
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'security'}
					on:click={() => activeTab = 'security'}
				>
					<Shield size={20} />
					<span>보안</span>
					<ChevronRight size={16} />
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'notifications'}
					on:click={() => activeTab = 'notifications'}
				>
					<Bell size={20} />
					<span>알림</span>
					<ChevronRight size={16} />
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'preferences'}
					on:click={() => activeTab = 'preferences'}
				>
					<Monitor size={20} />
					<span>환경설정</span>
					<ChevronRight size={16} />
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'integrations'}
					on:click={() => activeTab = 'integrations'}
				>
					<Zap size={20} />
					<span>통합</span>
					<ChevronRight size={16} />
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'data'}
					on:click={() => activeTab = 'data'}
				>
					<Database size={20} />
					<span>데이터 및 개인정보</span>
					<ChevronRight size={16} />
				</button>
			</nav>
		</aside>

		<main class="settings-content">
			{#if activeTab === 'profile'}
				<section class="settings-section">
					<h2>프로필 정보</h2>

					<div class="form-section">
						<div class="avatar-section">
							<div class="avatar-preview">
								<User size={48} />
							</div>
							<div class="avatar-controls">
								<button class="btn-secondary">사진 변경</button>
								<button class="btn-text">삭제</button>
							</div>
						</div>

						<div class="form-grid">
							<div class="form-group">
								<label for="username">사용자명</label>
								<input
									id="username"
									type="text"
									bind:value={profile.username}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="email">이메일</label>
								<input
									id="email"
									type="email"
									bind:value={profile.email}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="fullName">전체 이름</label>
								<input
									id="fullName"
									type="text"
									bind:value={profile.fullName}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="department">부서</label>
								<input
									id="department"
									type="text"
									bind:value={profile.department}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="role">역할</label>
								<input
									id="role"
									type="text"
									bind:value={profile.role}
									readonly
								/>
							</div>
							<div class="form-group">
								<label for="phone">전화번호</label>
								<input
									id="phone"
									type="tel"
									bind:value={profile.phone}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="location">위치</label>
								<input
									id="location"
									type="text"
									bind:value={profile.location}
									on:input={() => isDirty = true}
								/>
							</div>
							<div class="form-group">
								<label for="joinDate">가입일</label>
								<input
									id="joinDate"
									type="text"
									value={profile.joinDate}
									readonly
								/>
							</div>
						</div>

						<div class="form-group full-width">
							<label for="bio">소개</label>
							<textarea
								id="bio"
								bind:value={profile.bio}
								on:input={() => isDirty = true}
								rows="3"
							></textarea>
						</div>

						<div class="form-actions">
							<button
								class="btn-primary"
								on:click={handleSaveProfile}
								disabled={!isDirty || isSaving}
							>
								{#if isSaving}
									<RefreshCw size={16} class="spin" />
								{:else}
									<Save size={16} />
								{/if}
								저장
							</button>
							<button class="btn-secondary" disabled={!isDirty}>
								취소
							</button>
						</div>
					</div>
				</section>
			{:else if activeTab === 'security'}
				<section class="settings-section">
					<h2>보안 설정</h2>

					<div class="security-sections">
						<div class="subsection">
							<h3>비밀번호 변경</h3>
							<div class="form-grid">
								<div class="form-group">
									<label for="currentPassword">현재 비밀번호</label>
									<div class="password-input">
										<input
											id="currentPassword"
											type={showPassword ? 'text' : 'password'}
											bind:value={passwordForm.current}
										/>
										<button
											class="btn-icon"
											on:click={() => showPassword = !showPassword}
										>
											{#if showPassword}
												<EyeOff size={16} />
											{:else}
												<Eye size={16} />
											{/if}
										</button>
									</div>
								</div>
								<div></div>
								<div class="form-group">
									<label for="newPassword">새 비밀번호</label>
									<div class="password-input">
										<input
											id="newPassword"
											type={showNewPassword ? 'text' : 'password'}
											bind:value={passwordForm.new}
										/>
										<button
											class="btn-icon"
											on:click={() => showNewPassword = !showNewPassword}
										>
											{#if showNewPassword}
												<EyeOff size={16} />
											{:else}
												<Eye size={16} />
											{/if}
										</button>
									</div>
								</div>
								<div class="form-group">
									<label for="confirmPassword">비밀번호 확인</label>
									<input
										id="confirmPassword"
										type="password"
										bind:value={passwordForm.confirm}
									/>
								</div>
							</div>
							<button class="btn-primary" on:click={handleChangePassword}>
								비밀번호 변경
							</button>
						</div>

						<div class="subsection">
							<h3>2단계 인증</h3>
							<div class="security-option">
								<div class="option-info">
									<p><strong>2단계 인증</strong></p>
									<p class="text-secondary">추가 보안을 위해 2단계 인증을 활성화합니다</p>
								</div>
								<label class="toggle">
									<input type="checkbox" bind:checked={security.twoFactorEnabled} />
									<span class="toggle-slider"></span>
								</label>
							</div>
						</div>

						<div class="subsection">
							<h3>API 키</h3>
							<div class="api-keys">
								{#each security.apiKeys as key}
									<div class="api-key-item">
										<div class="key-info">
											<p class="key-name">{key.name}</p>
											<div class="key-meta">
												<span>생성: {key.created}</span>
												<span>마지막 사용: {key.lastUsed}</span>
												<span>권한: {key.permissions.join(', ')}</span>
											</div>
										</div>
										<div class="key-actions">
											<button
												class="btn-icon"
												on:click={() => copyToClipboard(key.key)}
											>
												<Copy size={16} />
											</button>
											<button
												class="btn-icon danger"
												on:click={() => handleRevokeApiKey(key.id)}
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								{/each}
							</div>
							<button class="btn-secondary" on:click={handleGenerateApiKey}>
								<Plus size={16} />
								새 API 키 생성
							</button>
						</div>

						<div class="subsection">
							<h3>활성 세션</h3>
							<div class="sessions">
								{#each security.sessions as session}
									<div class="session-item">
										<div class="session-info">
											<p class="session-device">
												{session.device}
												{#if session.current}
													<span class="badge">현재 세션</span>
												{/if}
											</p>
											<div class="session-meta">
												<span>IP: {session.ip}</span>
												<span>위치: {session.location}</span>
												<span>활동: {session.lastActive}</span>
											</div>
										</div>
										{#if !session.current}
											<button
												class="btn-text danger"
												on:click={() => handleTerminateSession(session.id)}
											>
												종료
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</section>
			{:else if activeTab === 'notifications'}
				<section class="settings-section">
					<h2>알림 설정</h2>

					<div class="notification-channels">
						<div class="channel">
							<h3>이메일 알림</h3>
							<div class="notification-options">
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.email.builds} />
									<span>빌드 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.email.approvals} />
									<span>승인 요청</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.email.deployments} />
									<span>배포 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.email.security} />
									<span>보안 알림</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.email.updates} />
									<span>시스템 업데이트</span>
								</label>
							</div>
						</div>

						<div class="channel">
							<h3>푸시 알림</h3>
							<div class="notification-options">
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.push.builds} />
									<span>빌드 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.push.approvals} />
									<span>승인 요청</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.push.deployments} />
									<span>배포 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.push.security} />
									<span>보안 알림</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.push.updates} />
									<span>시스템 업데이트</span>
								</label>
							</div>
						</div>

						<div class="channel">
							<h3>Slack 알림</h3>
							<div class="notification-options">
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.slack.builds} />
									<span>빌드 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.slack.approvals} />
									<span>승인 요청</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.slack.deployments} />
									<span>배포 상태</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.slack.security} />
									<span>보안 알림</span>
								</label>
								<label class="checkbox-label">
									<input type="checkbox" bind:checked={notifications.slack.updates} />
									<span>시스템 업데이트</span>
								</label>
							</div>
						</div>
					</div>

					<div class="form-actions">
						<button class="btn-primary">
							<Save size={16} />
							알림 설정 저장
						</button>
					</div>
				</section>
			{:else if activeTab === 'preferences'}
				<section class="settings-section">
					<h2>환경 설정</h2>

					<div class="preferences-grid">
						<div class="form-group">
							<label for="theme">테마</label>
							<select id="theme" bind:value={preferences.theme}>
								<option value="light">라이트</option>
								<option value="dark">다크</option>
								<option value="auto">시스템 설정 따르기</option>
							</select>
						</div>
						<div class="form-group">
							<label for="language">언어</label>
							<select id="language" bind:value={preferences.language}>
								<option value="ko">한국어</option>
								<option value="en">English</option>
								<option value="ja">日本語</option>
								<option value="zh">中文</option>
							</select>
						</div>
						<div class="form-group">
							<label for="timezone">시간대</label>
							<select id="timezone" bind:value={preferences.timezone}>
								<option value="Asia/Seoul">Seoul (GMT+9)</option>
								<option value="Asia/Tokyo">Tokyo (GMT+9)</option>
								<option value="America/New_York">New York (GMT-5)</option>
								<option value="Europe/London">London (GMT+0)</option>
							</select>
						</div>
						<div class="form-group">
							<label for="dateFormat">날짜 형식</label>
							<select id="dateFormat" bind:value={preferences.dateFormat}>
								<option value="YYYY-MM-DD">2024-03-15</option>
								<option value="DD/MM/YYYY">15/03/2024</option>
								<option value="MM/DD/YYYY">03/15/2024</option>
							</select>
						</div>
						<div class="form-group">
							<label for="timeFormat">시간 형식</label>
							<select id="timeFormat" bind:value={preferences.timeFormat}>
								<option value="24h">24시간 (14:30)</option>
								<option value="12h">12시간 (2:30 PM)</option>
							</select>
						</div>
						<div class="form-group">
							<label for="firstDayOfWeek">주 시작일</label>
							<select id="firstDayOfWeek" bind:value={preferences.firstDayOfWeek}>
								<option value="sunday">일요일</option>
								<option value="monday">월요일</option>
							</select>
						</div>
						<div class="form-group">
							<label for="pageSize">페이지 크기</label>
							<select id="pageSize" bind:value={preferences.pageSize}>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
						<div class="form-group">
							<label for="refreshInterval">자동 새로고침 간격 (초)</label>
							<input
								id="refreshInterval"
								type="number"
								bind:value={preferences.refreshInterval}
								min="10"
								max="300"
							/>
						</div>
					</div>

					<div class="preference-toggles">
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={preferences.compactMode} />
							<span>컴팩트 모드</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={preferences.showLineNumbers} />
							<span>줄 번호 표시</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={preferences.autoRefresh} />
							<span>자동 새로고침</span>
						</label>
					</div>

					<div class="form-actions">
						<button class="btn-primary">
							<Save size={16} />
							환경 설정 저장
						</button>
						<button class="btn-secondary">
							기본값으로 재설정
						</button>
					</div>
				</section>
			{:else if activeTab === 'integrations'}
				<section class="settings-section">
					<h2>통합 연결</h2>

					<div class="integrations-list">
						{#each integrations as integration}
							<div class="integration-card">
								<div class="integration-header">
									<svelte:component this={integration.icon} size={24} />
									<h3>{integration.name}</h3>
									{#if integration.connected}
										<span class="status-badge success">연결됨</span>
									{:else}
										<span class="status-badge">미연결</span>
									{/if}
								</div>
								<div class="integration-body">
									{#if integration.connected}
										<p class="integration-info">
											<strong>계정:</strong> {integration.username}
										</p>
										<p class="integration-info">
											<strong>마지막 동기화:</strong> {integration.lastSync}
										</p>
									{:else}
										<p class="text-secondary">
											{integration.name}과 연결하여 작업을 자동화하세요
										</p>
									{/if}
								</div>
								<div class="integration-actions">
									{#if integration.connected}
										<button class="btn-secondary">
											<RefreshCw size={16} />
											동기화
										</button>
										<button
											class="btn-text danger"
											on:click={() => handleToggleIntegration(integration.id)}
										>
											연결 해제
										</button>
									{:else}
										<button
											class="btn-primary"
											on:click={() => handleToggleIntegration(integration.id)}
										>
											연결하기
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'data'}
				<section class="settings-section">
					<h2>데이터 및 개인정보</h2>

					<div class="data-sections">
						<div class="subsection">
							<h3>데이터 내보내기</h3>
							<p class="text-secondary">
								모든 개인 데이터의 사본을 요청할 수 있습니다. 준비되면 이메일로 알림을 받습니다.
							</p>
							<button class="btn-primary" on:click={handleExportData}>
								<Download size={16} />
								데이터 내보내기 요청
							</button>

							{#if dataExportRequests.length > 0}
								<div class="export-requests">
									<h4>내보내기 요청 내역</h4>
									{#each dataExportRequests as request}
										<div class="export-item">
											<div class="export-info">
												<span>{request.date}</span>
												<span class="status-badge" class:success={request.status === 'completed'}>
													{request.status === 'completed' ? '완료' : '처리 중'}
												</span>
												<span>{request.size}</span>
											</div>
											{#if request.status === 'completed'}
												<a href={request.url} class="btn-text">
													<Download size={16} />
													다운로드
												</a>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<div class="subsection">
							<h3>데이터 보존</h3>
							<p class="text-secondary">
								데이터는 다음 정책에 따라 보존됩니다:
							</p>
							<ul class="retention-policy">
								<li>빌드 로그: 90일</li>
								<li>배포 기록: 1년</li>
								<li>감사 로그: 2년</li>
								<li>프로젝트 데이터: 무제한</li>
							</ul>
						</div>

						<div class="subsection danger-zone">
							<h3>위험 구역</h3>
							<div class="danger-item">
								<div>
									<p><strong>계정 비활성화</strong></p>
									<p class="text-secondary">
										계정을 일시적으로 비활성화합니다. 언제든지 다시 활성화할 수 있습니다.
									</p>
								</div>
								<button class="btn-secondary danger">비활성화</button>
							</div>
							<div class="danger-item">
								<div>
									<p><strong>계정 삭제</strong></p>
									<p class="text-secondary">
										계정과 모든 관련 데이터를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
									</p>
								</div>
								<button class="btn-secondary danger" on:click={handleDeleteAccount}>
									<Trash2 size={16} />
									계정 삭제
								</button>
							</div>
						</div>
					</div>
				</section>
			{/if}
		</main>
	</div>
</div>

<style>
	.settings-container {
		padding: var(--spacing-6);
		max-width: 1400px;
		margin: 0 auto;
	}

	.settings-header {
		margin-bottom: var(--spacing-8);
	}

	.settings-header h1 {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-bottom: var(--spacing-2);
	}

	.settings-header p {
		color: var(--text-secondary);
	}

	.settings-layout {
		display: grid;
		grid-template-columns: 240px 1fr;
		gap: var(--spacing-8);
	}

	.settings-sidebar {
		position: sticky;
		top: var(--spacing-6);
		height: fit-content;
	}

	.settings-nav {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		padding: var(--spacing-3) var(--spacing-4);
		background: transparent;
		border: 1px solid transparent;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
	}

	.nav-item:hover {
		background: var(--bg-secondary);
	}

	.nav-item.active {
		background: var(--fg);
		color: var(--bg);
		border-color: var(--fg);
	}

	.nav-item span {
		flex: 1;
	}

	.settings-content {
		min-height: 600px;
	}

	.settings-section {
		background: var(--bg);
		border: 1px solid var(--border);
		padding: var(--spacing-6);
	}

	.settings-section h2 {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--spacing-6);
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
	}

	.avatar-section {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		padding-bottom: var(--spacing-6);
		border-bottom: 1px solid var(--border);
	}

	.avatar-preview {
		width: 96px;
		height: 96px;
		border: 2px solid var(--fg);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
	}

	.avatar-controls {
		display: flex;
		gap: var(--spacing-3);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.form-group input,
	.form-group textarea,
	.form-group select {
		padding: var(--spacing-3);
		border: 1px solid var(--border);
		background: var(--bg);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.form-group input[readonly] {
		background: var(--bg-secondary);
		opacity: 0.7;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-3);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--border);
	}

	.btn-primary,
	.btn-secondary,
	.btn-text {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-4);
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

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--bg-secondary);
	}

	.btn-text {
		border: none;
		padding: var(--spacing-2);
	}

	.btn-text:hover:not(:disabled) {
		background: var(--bg-secondary);
	}

	.btn-text.danger,
	.btn-secondary.danger {
		color: var(--error);
		border-color: var(--error);
	}

	.btn-icon {
		padding: var(--spacing-2);
		border: 1px solid var(--border);
		background: var(--bg);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.btn-icon:hover {
		background: var(--bg-secondary);
	}

	.btn-icon.danger {
		color: var(--error);
		border-color: var(--error);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.security-sections,
	.data-sections {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
	}

	.subsection {
		padding-bottom: var(--spacing-6);
		border-bottom: 1px solid var(--border);
	}

	.subsection:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.subsection h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--spacing-4);
	}

	.password-input {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.password-input input {
		flex: 1;
	}

	.security-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4);
		border: 1px solid var(--border);
	}

	.option-info p {
		margin: 0;
	}

	.text-secondary {
		color: var(--text-secondary);
		font-size: var(--text-sm);
		margin-top: var(--spacing-1);
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
	}

	.toggle input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--bg-secondary);
		border: 1px solid var(--fg);
		transition: 0.4s;
	}

	.toggle-slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 2px;
		bottom: 2px;
		background-color: var(--fg);
		transition: 0.4s;
	}

	.toggle input:checked + .toggle-slider {
		background-color: var(--fg);
	}

	.toggle input:checked + .toggle-slider:before {
		transform: translateX(24px);
		background-color: var(--bg);
	}

	.api-keys,
	.sessions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		margin: var(--spacing-4) 0;
	}

	.api-key-item,
	.session-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4);
		border: 1px solid var(--border);
		background: var(--bg-secondary);
	}

	.key-info,
	.session-info {
		flex: 1;
	}

	.key-name,
	.session-device {
		font-weight: 500;
		margin-bottom: var(--spacing-2);
	}

	.key-meta,
	.session-meta {
		display: flex;
		gap: var(--spacing-4);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.key-actions {
		display: flex;
		gap: var(--spacing-2);
	}

	.badge {
		display: inline-block;
		padding: var(--spacing-1) var(--spacing-2);
		background: var(--fg);
		color: var(--bg);
		font-size: var(--text-xs);
		margin-left: var(--spacing-2);
	}

	.status-badge {
		padding: var(--spacing-1) var(--spacing-3);
		border: 1px solid var(--fg);
		font-size: var(--text-sm);
	}

	.status-badge.success {
		background: var(--fg);
		color: var(--bg);
	}

	.notification-channels {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-6);
	}

	.channel {
		border: 1px solid var(--border);
		padding: var(--spacing-4);
	}

	.channel h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--spacing-4);
	}

	.notification-options {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		cursor: pointer;
	}

	.checkbox-label input[type="checkbox"] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.preferences-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-4);
		margin-bottom: var(--spacing-6);
	}

	.preference-toggles {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		padding: var(--spacing-4) 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		margin-bottom: var(--spacing-6);
	}

	.integrations-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-4);
	}

	.integration-card {
		border: 1px solid var(--border);
		padding: var(--spacing-4);
	}

	.integration-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		margin-bottom: var(--spacing-4);
	}

	.integration-header h3 {
		flex: 1;
		font-size: var(--text-lg);
		font-weight: 600;
	}

	.integration-body {
		margin-bottom: var(--spacing-4);
	}

	.integration-info {
		font-size: var(--text-sm);
		margin-bottom: var(--spacing-1);
	}

	.integration-actions {
		display: flex;
		gap: var(--spacing-2);
	}

	.export-requests {
		margin-top: var(--spacing-6);
	}

	.export-requests h4 {
		font-size: var(--text-md);
		font-weight: 600;
		margin-bottom: var(--spacing-3);
	}

	.export-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-3);
		border: 1px solid var(--border);
		margin-bottom: var(--spacing-2);
	}

	.export-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		font-size: var(--text-sm);
	}

	.retention-policy {
		list-style: none;
		padding: 0;
		margin: var(--spacing-4) 0;
	}

	.retention-policy li {
		padding: var(--spacing-2) 0;
		border-bottom: 1px solid var(--border);
		font-size: var(--text-sm);
	}

	.danger-zone {
		background: var(--bg-secondary);
		padding: var(--spacing-4);
		border: 2px solid var(--error);
	}

	.danger-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4) 0;
		border-bottom: 1px solid var(--border);
	}

	.danger-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>