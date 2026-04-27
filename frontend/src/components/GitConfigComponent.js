import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { gitConfigAPI } from '../services/api';
import { UserContext } from '../context/UserContext';

const GitConfigComponent = () => {
  const { userId } = useContext(UserContext);
  const [formData, setFormData] = useState({
    userName: 'abcd',
    userEmail: 'ab.gf@siemens.com',
    autoCrlf: true,
    symlinks: true,
    fscache: true,
    longpaths: true,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [configContent, setConfigContent] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await gitConfigAPI.saveConfig(userId, formData);
      setSaved(true);
      generatePreview();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = () => {
    const content = `[credential "https://code.siemens.com"]
\tprovider = generic

[user]
\tname = ${formData.userName}
\temail = ${formData.userEmail}

[core]
\tautocrlf = ${formData.autoCrlf ? 'true' : 'false'}
\tsymlinks = ${formData.symlinks ? 'true' : 'false'}
\tfscache = ${formData.fscache ? 'true' : 'false'}
\tlongpaths = ${formData.longpaths ? 'true' : 'false'}

[http]
\tschannelCheckRevoke = true`;
    setConfigContent(content);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([configContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '.gitconfig';
    element.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(configContent);
    alert('Configuration copied to clipboard');
  };

  return (
    <Container className="mt-5">
      <div className="row">
        <div className="col-md-8">
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-cog"></i> Git Configuration
              </h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {saved && <Alert variant="success">Configuration saved successfully!</Alert>}
              
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-user"></i> Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your Git username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-envelope"></i> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <hr />

                <h5 className="mb-3">Core Settings</h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      id="autoCrlf"
                      name="autoCrlf"
                      label="Auto CRLF (Line endings)"
                      checked={formData.autoCrlf}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      id="symlinks"
                      name="symlinks"
                      label="Symlinks Support"
                      checked={formData.symlinks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      id="fscache"
                      name="fscache"
                      label="File System Cache"
                      checked={formData.fscache}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      id="longpaths"
                      name="longpaths"
                      label="Long Paths Support"
                      checked={formData.longpaths}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button variant="outline-secondary" type="reset">
                    <i className="fas fa-redo"></i> Reset
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-eye"></i> Configuration Preview
              </h5>
            </Card.Header>
            <Card.Body>
              <pre className="bg-dark text-light p-3 rounded" style={{ fontSize: '0.85rem', maxHeight: '400px', overflowY: 'auto' }}>
                {configContent}
              </pre>
              <div className="d-grid gap-2 mt-3">
                <Button size="sm" variant="info" onClick={handleCopy}>
                  <i className="fas fa-copy"></i> Copy
                </Button>
                <Button size="sm" variant="success" onClick={handleDownload}>
                  <i className="fas fa-download"></i> Download
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default GitConfigComponent;
