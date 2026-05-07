import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GitIntegrationService } from '../../services/git-integration.service';

@Component({
  selector: 'app-ssh-key-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ssh-key-generator.component.html',
  styleUrls: ['./ssh-key-generator.component.css']
})
export class SshKeyGeneratorComponent implements OnInit {
  sshForm: FormGroup;
  isLoading = false;
  sshKeyGenerated = false;
  generatedPublicKey = '';
  keyPath = '';
  showPublicKey = false;

  constructor(
    private fb: FormBuilder,
    private gitService: GitIntegrationService
  ) {
    this.sshForm = this.fb.group({
      email: ['ab.gf@siemens.com', [Validators.required, Validators.email]],
      keyPath: [this.getDefaultKeyPath(), Validators.required],
      keyType: ['ed25519', Validators.required]
    });
  }

  ngOnInit(): void {}

  getDefaultKeyPath(): string {
    const isWindows = /^[A-Z]:/.test(window.location.pathname);
    return isWindows ? 'C:\\Users\\USERNAME\\.ssh' : '/home/username/.ssh';
  }

  generateSSHKey(): void {
    if (this.sshForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    const { email, keyPath } = this.sshForm.value;

    this.gitService.generateSSHKey(email, keyPath).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.generatedPublicKey = response.publicKey || '';
          this.keyPath = response.keyPath || '';
          this.sshKeyGenerated = true;
          alert(response.message);
        }
      },
      (error) => {
        this.isLoading = false;
        alert(error.message || 'Failed to generate SSH key');
      }
    );
  }

  copyPublicKey(): void {
    navigator.clipboard.writeText(this.generatedPublicKey).then(() => {
      alert('Public key copied to clipboard');
    });
  }

  downloadPublicKey(): void {
    const element = document.createElement('a');
    const file = new Blob([this.generatedPublicKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'id_ed25519.pub';
    element.click();
    alert('Public key downloaded');
  }

  copyPrivateKeyPath(): void {
    navigator.clipboard.writeText(this.keyPath).then(() => {
      alert('Key path copied to clipboard');
    });
  }

  resetForm(): void {
    this.sshForm.reset({
      email: 'ab.gf@siemens.com',
      keyPath: this.getDefaultKeyPath(),
      keyType: 'ed25519'
    });
    this.sshKeyGenerated = false;
    this.generatedPublicKey = '';
    this.keyPath = '';
    this.showPublicKey = false;
  }
}
