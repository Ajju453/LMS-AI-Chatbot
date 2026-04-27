import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface GitConfig {
  userName: string;
  userEmail: string;
  sshKeyPath: string;
  gitServerUrl: string;
  autoClrf: boolean;
  symlinks: boolean;
  fscache: boolean;
  longpaths: boolean;
}

interface SSHKeyResponse {
  success: boolean;
  message: string;
  publicKey?: string;
  keyPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitIntegrationService {
  private gitConfigSubject = new BehaviorSubject<GitConfig | null>(null);
  public gitConfig$ = this.gitConfigSubject.asObservable();

  private sshStatusSubject = new BehaviorSubject<string>('Not configured');
  public sshStatus$ = this.sshStatusSubject.asObservable();

  constructor() {
    this.loadGitConfig();
  }

  /**
   * Load Git configuration from localStorage
   */
  private loadGitConfig(): void {
    const savedConfig = localStorage.getItem('gitConfig');
    if (savedConfig) {
      this.gitConfigSubject.next(JSON.parse(savedConfig));
    }
  }

  /**
   * Save Git configuration
   */
  saveGitConfig(config: GitConfig): Observable<any> {
    return new Observable(observer => {
      try {
        this.gitConfigSubject.next(config);
        localStorage.setItem('gitConfig', JSON.stringify(config));
        observer.next({ success: true, message: 'Git configuration saved successfully' });
        observer.complete();
      } catch (error) {
        observer.error({ success: false, message: 'Failed to save configuration' });
      }
    });
  }

  /**
   * Generate SSH Key
   */
  generateSSHKey(email: string, keysPath: string): Observable<SSHKeyResponse> {
    return new Observable(observer => {
      // Simulate SSH key generation
      const publicKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG/...truncated... ${email}`;
      
      setTimeout(() => {
        this.sshStatusSubject.next('SSH key generated successfully');
        observer.next({
          success: true,
          message: 'SSH key generated successfully',
          publicKey: publicKey,
          keyPath: `${keysPath}/id_ed25519`
        });
        observer.complete();
      }, 1500);
    });
  }

  /**
   * Clone a Git repository
   */
  cloneRepository(repoUrl: string, localPath: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: `Repository cloned to ${localPath}`,
          url: repoUrl,
          path: localPath
        });
        observer.complete();
      }, 2000);
    });
  }

  /**
   * Initialize a new Git repository
   */
  initializeRepository(localPath: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: `Repository initialized at ${localPath}`
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Test Git connection
   */
  testGitConnection(serverUrl: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: `Successfully connected to ${serverUrl}`,
          status: 'Connected'
        });
        observer.complete();
      }, 1500);
    });
  }

  /**
   * Get current Git configuration
   */
  getGitConfig(): GitConfig | null {
    return this.gitConfigSubject.value;
  }

  /**
   * Generate .gitconfig file content
   */
  generateGitConfigContent(config: GitConfig): string {
    return `[credential "https://code.siemens.com"]
\tprovider = generic

[user]
\tname = ${config.userName}
\temail = ${config.userEmail}

[core]
\tautocrlf = ${config.autoClrf ? 'true' : 'false'}
\tsymlinks = ${config.symlinks ? 'true' : 'false'}
\tfscache = ${config.fscache ? 'true' : 'false'}
\tlongpaths = ${config.longpaths ? 'true' : 'false'}

[http]
\tschannelCheckRevoke = true`;
  }
}
