import { Component, OnInit } from '@angular/core';
import { GitIntegrationService } from '../../services/git-integration.service';

@Component({
  selector: 'app-git-integration-dashboard',
  templateUrl: './git-integration-dashboard.component.html',
  styleUrls: ['./git-integration-dashboard.component.css']
})
export class GitIntegrationDashboardComponent implements OnInit {
  activeTab = 'overview';
  gitConfigured = false;
  sshConfigured = false;
  isLoading = false;
  connectionStatus = 'Not tested';
  connectionStatusClass = 'secondary';

  constructor(private gitService: GitIntegrationService) {}

  ngOnInit(): void {
    this.checkConfiguration();
  }

  checkConfiguration(): void {
    const config = this.gitService.getGitConfig();
    this.gitConfigured = !!config;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  testGitConnection(): void {
    this.isLoading = true;
    this.gitService.testGitConnection('https://code.siemens.com').subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.connectionStatus = 'Connected';
          this.connectionStatusClass = 'success';
          alert(response.message);
        }
      },
      (error) => {
        this.isLoading = false;
        this.connectionStatus = 'Failed';
        this.connectionStatusClass = 'danger';
        alert(error.message || 'Connection test failed');
      }
    );
  }

  cloneRepository(): void {
    const repoUrl = prompt('Enter repository URL:');
    if (!repoUrl) return;

    const localPath = prompt('Enter local path to clone to:');
    if (!localPath) return;

    this.isLoading = true;
    this.gitService.cloneRepository(repoUrl, localPath).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          alert(response.message);
        }
      },
      (error) => {
        this.isLoading = false;
        alert(error.message || 'Failed to clone repository');
      }
    );
  }

  openVSCode(): void {
    alert('Opening VS Code... (Manual action required)');
    // In a real application, this would launch VS Code or provide instructions
  }

  openGitServer(): void {
    window.open('https://code.siemens.com', '_blank');
  }
}
