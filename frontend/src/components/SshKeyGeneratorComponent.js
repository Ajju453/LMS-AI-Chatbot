import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { sshKeyAPI } from '../services/api';
import { UserContext } from '../context/UserContext';

const SshKeyGeneratorComponent = () => {
  const { userId } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: 'ab.gf@siemens.com',
    keyType: 'ed25519',
    keyPath: 'C:\\Users\\USERNAME\\.ssh',
  });
  const [loading, setLoading] = useState(false);
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [keyPath, setKeyPath] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await sshKeyAPI.generateKey(userId, {
        email: formData.email,
        keyType: formData.keyType,
        keyPath: formData.keyPath,
      });
      setPublicKey(response.data.data.publicKey);
      setKeyPath(response.data.data.keyPath);
      setKeyGenerated(true);
    } catch (err) {
      setError('Failed to generate SSH key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPublicKey = () => {
    navigator.clipboard.writeText(publicKey);
    alert('Public key copied to clipboard');
  };

  const handleDownloadPublicKey = () => {
    const element = document.createElement('a');
    const file = new Blob([publicKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'id_ed25519.pub';
    element.click();
  };

  const handleReset = () => {
    setFormData({
      email: 'ab.gf@siemens.com',
      keyType: 'ed25519',
      keyPath: 'C:\\Users\\USERNAME\\.ssh',
    });
    setKeyGenerated(false);
    setPublicKey('');
    setKeyPath('');
    setShowKey(false);
  };

  return (
    <Container className="mt-5">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">
                <i className="fas fa-key"></i> SSH Key Generator
              </h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <h5>
                  <i className="fas fa-info-circle"></i> How to Generate SSH Keys
                </h5>
                <ol className="mb-0">
                  <li>Enter your email address</li>
                  <li>Specify the location to save keys</li>
                  <li>Click "Generate SSH Key"</li>
                  <li>Copy the public key to code.siemens.com</li>
                </ol>
              </Alert>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleGenerateKey}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-envelope"></i> Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@siemens.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-folder"></i> Key Storage Path
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="keyPath"
                    value={formData.keyPath}
                    onChange={handleInputChange}
                    required
                    placeholder="/home/username/.ssh"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-lock"></i> Key Type
                  </Form.Label>
                  <Form.Select
                    name="keyType"
                    value={formData.keyType}
                    onChange={handleInputChange}
                  >
                    <option value="ed25519">ED25519 (Recommended)</option>
                    <option value="rsa">RSA 4096</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="success"
                  className="w-100"
                  type="submit"
                  disabled={loading}
                >
                  <i className="fas fa-key"></i> {loading ? 'Generating Key...' : 'Generate SSH Key'}
                </Button>
              </Form>

              {keyGenerated && (
                <Card className="mt-5 border-success">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-check-circle"></i> SSH Key Generated Successfully!
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="fas fa-lock"></i> Private Key Path
                      </Form.Label>
                      <div className="input-group">
                        <Form.Control value={keyPath} readOnly />
                        <Button
                          variant="outline-primary"
                          onClick={() => navigator.clipboard.writeText(keyPath)}
                        >
                          <i className="fas fa-copy"></i> Copy
                        </Button>
                      </div>
                      <small className="text-muted d-block mt-2">
                        <i className="fas fa-exclamation-triangle text-warning"></i> Keep this secure!
                      </small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="fw-bold mb-0">
                          <i className="fas fa-unlock"></i> Public Key
                        </Form.Label>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => setShowKey(!showKey)}
                        >
                          <i className={showKey ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                          {showKey ? ' Hide' : ' Show'}
                        </Button>
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={publicKey}
                        readOnly
                        type={showKey ? 'text' : 'password'}
                        style={{ fontSize: '0.85rem', fontFamily: "'Courier New', monospace" }}
                      />
                    </Form.Group>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <Button variant="outline-secondary" onClick={handleReset}>
                        <i className="fas fa-redo"></i> Generate Another Key
                      </Button>
                      <Button variant="info" onClick={handleCopyPublicKey}>
                        <i className="fas fa-copy"></i> Copy Public Key
                      </Button>
                      <Button variant="primary" onClick={handleDownloadPublicKey}>
                        <i className="fas fa-download"></i> Download
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default SshKeyGeneratorComponent;
