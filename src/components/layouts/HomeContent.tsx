import { Card, Row, Col } from 'antd';
import { StockOutlined, LineChartOutlined, BellOutlined } from '@ant-design/icons';
import '../../assets/css/HomeContent.css';
import backgroundImage from '../../assets/images/istockphoto.jpg';
function HomeContent() {
    return (
        <div className="home-content-container">
          <div className="home-content-background">
            <img 
              src={backgroundImage} 
              alt="Background" 
              className="background-image" 
            />
          </div>
          <div className="home-content-description">
            <Card className="home-content-card">
            <h1 className="main-title">Welcome to Portfolio Management</h1>
            <p className="main-subtitle">Discover our features and manage your investments efficiently.</p>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card title="Real-time Data" bordered={false} className="feature-card">
                    <div className="feature-card-content">
                      <StockOutlined className="feature-icon" />
                      <div className="feature-text">
                      Manage your portfolio with real-time date and performance updates for investments.
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Detailed Analysis" bordered={false} className="feature-card">
                    <div className="feature-card-content">
                      <LineChartOutlined className="feature-icon" />
                      <div className="feature-text">
                      Access comprehensive financial information, including company reports and valuation metrics.
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Personalized News" bordered={false} className="feature-card">
                    <div className="feature-card-content">
                      <BellOutlined className="feature-icon" />
                      <div className="feature-text">
                      Get tailored news and market alerts based on your portfolio and followed companies.
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      );
}

export default HomeContent;