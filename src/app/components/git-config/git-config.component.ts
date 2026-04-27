import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GitIntegrationService } from '../../services/git-integration.service';

@Component({
  selector: 'app-git-config',
  templateUrl: './git-config.component.html',
  styleUrls: ['./git-config.component.css']
})
export class GitConfigComponent implements OnInit {
  gitConfigForm: FormGroup;
  isLoading = false;
  configSaved = false;
  gitConfigContent = '';

  constructor(
    private fb: FormBuilder,
    private gitService: GitIntegrationService
  ) {
    this.gitConfigForm = this.fb.group({
      userName: ['abcd', Validators.required],
      userEmail: ['ab.gf@siemens.com', [Validators.required, Validators.email]],
      autoClrf: [true],
      symlinks: [true],
      fscache: [true],
      longpaths: [true]
    });
  }

  ngOnInit(): void {
    const savedConfig = this.gitService.getGitConfig();
    if (savedConfig) {
      this.gitConfigForm.patchValue(savedConfig);
    }
    this.generatePreview();
  }

  saveConfiguration(): void {
    if (this.gitConfigForm.invalid) {
      alert('Please fill in all required fields correctly');
      return;
    }

    this.isLoading = true;
    const config = this.gitConfigForm.value;

    this.gitService.saveGitConfig(config).subscribe(
      (response) => {
        this.isLoading = false;
        this.configSaved = true;
        alert(response.message);
        this.generatePreview();
        setTimeout(() => this.configSaved = false, 3000);
      },
      (error) => {
        this.isLoading = false;
        alert(error.message || 'Failed to save configuration');
      }
    );
  }

  generatePreview(): void {
    const config = this.gitConfigForm.value;
    this.gitConfigContent = this.gitService.generateGitConfigContent(config);
  }

  downloadGitConfig(): void {
    const config = this.gitConfigForm.value;
    const content = this.gitService.generateGitConfigContent(config);
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '.gitconfig';
    element.click();
    alert('.gitconfig file downloaded');
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.gitConfigContent).then(() => {
      alert('Configuration copied to clipboard');
    });
  }
}
