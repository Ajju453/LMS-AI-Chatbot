import React, { useState } from 'react';
import { Container, Navbar, Nav, Tab, Tabs, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GitConfigComponent from './components/GitConfigComponent';
import SshKeyGeneratorComponent from './components/SshKeyGeneratorComponent';
import TaskManagerComponent from './components/TaskManagerComponent';
import { UserProvider } from './context/UserContext';

function App() {
  const [activeTab, setActiveTab] = useState('git');
  const [error, setError] = useState('');

  return (
    <UserProvider>
      <div className="app-wrapper">
        {/* Navigation Bar */}
        <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom">
          <Container fluid>
            <Navbar.Brand className="fw-bold">
              <i className="fas fa-code-branch"></i> Git-VSCode Integration Hub
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="ms-auto">
                <Nav.Link
                  active={activeTab === 'git'}
                  onClick={() => setActiveTab('git')}
                  className="nav-link-custom"
                >
                  <i className="fas fa-git-alt"></i> Git Setup
                </Nav.Link>
                <Nav.Link
                  active={activeTab === 'tasks'}
                  onClick={() => setActiveTab('tasks')}
                  className="nav-link-custom"
                >
                  <i className="fas fa-tasks"></i> Task Manager
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <div className="tab-view">
          {error && (
            <Alert variant="danger" className="m-3" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {activeTab === 'git' && (
            <Tabs defaultActiveKey="config" className="mb-0 git-tabs">
              <Tab eventKey="config" title={<><i className="fas fa-cog"></i> Configuration</>}>
                <div className="tab-content-wrapper">
                  <GitConfigComponent />
                </div>
              </Tab>
              <Tab eventKey="ssh" title={<><i className="fas fa-key"></i> SSH Keys</>}>
                <div className="tab-content-wrapper">
                  <SshKeyGeneratorComponent />
                </div>
              </Tab>
              <Tab eventKey="guides" title={<><i className="fas fa-book"></i> Guides</>}>
                <Container className="mt-5">
                  <div className="guide-content">
                    <h2>Setup Guides</h2>
                    <div className="guide-card mt-4">
                      <h4><i className="fab fa-windows"></i> Windows Setup</h4>
                      <ol>
                        <li>Fill in your Git configuration details</li>
                        <li>Download the .gitconfig file</li>
                        <li>Place it in your user home directory</li>
                        <li>Generate SSH keys using the SSH Keys tab</li>
                        <li>Add your public key to code.siemens.com</li>
                        <li>Reboot your system</li>
                      </ol>
                    </div>

                    <div className="guide-card mt-4">
                      <h4><i className="fab fa-linux"></i> Linux/Mac Setup</h4>
                      <ol>
                        <li>Configure Git using the Configuration tab</li>
                        <li>Generate SSH keys</li>
                        <li>Run: <code>chmod 700 ~/.ssh</code></li>
                        <li>Run: <code>chmod 600 ~/.ssh/id_ed25519</code></li>
                        <li>Add public key to code.siemens.com</li>
                        <li>Test with: <code>ssh -T git@code.siemens.com</code></li>
                      </ol>
                    </div>

                    <div className="guide-card mt-4">
                      <h4><i className="fas fa-bug"></i> Troubleshooting</h4>
                      <p><strong>Connection Fails:</strong> Check firewall allows port 22</p>
                      <p><strong>SSH Key Not Working:</strong> Ensure public key is added to server</p>
                      <p><strong>Config Not Applied:</strong> Restart VSCode and terminal</p>
                    </div>
                  </div>
                </Container>
              </Tab>
            </Tabs>
          )}

          {activeTab === 'tasks' && <TaskManagerComponent />}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;
