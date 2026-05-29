import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Row, Col, Space } from 'antd';
import {
  SendOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Footer.less';

const { Search } = Input;

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const handleSubscribe = (value: string) => {
    console.log('Subscribe:', value);
  };

  return (
    <footer className="footer">
      <div className="container">
        <Row gutter={[32, 32]}>
          {/* Subscribe */}
          <Col xs={24} sm={12} md={6} lg={5}>
            <div className="footer-section">
              <h3 className="footer-title">Exclusive</h3>
              <p className="footer-subtitle">{t('footer.subscribe')}</p>
              <p className="footer-desc">{t('footer.get_discount')}</p>
              <Search
                placeholder={t('footer.email_placeholder')}
                enterButton={<SendOutlined />}
                onSearch={handleSubscribe}
                className="subscribe-input"
              />
            </div>
          </Col>

          {/* Support */}
          <Col xs={24} sm={12} md={6} lg={5}>
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.support')}</h3>
              <div className="footer-links">
                <p>111 Bijoy sarani, Dhaka,</p>
                <p>DH 1515, Bangladesh.</p>
                <p>exclusive@gmail.com</p>
                <p>+88015-88888-9999</p>
              </div>
            </div>
          </Col>

          {/* Account */}
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.account')}</h3>
              <div className="footer-links">
                <Link to="/account">{t('footer.my_account')}</Link>
                <Link to="/login">{t('footer.login_register')}</Link>
                <Link to="/cart">{t('nav.cart')}</Link>
                <Link to="/wishlist">{t('nav.wishlist')}</Link>
                <Link to="/products">{t('footer.shop')}</Link>
              </div>
            </div>
          </Col>

          {/* Quick Link */}
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.quick_link')}</h3>
              <div className="footer-links">
                <Link to="/privacy-policy">{t('footer.privacy_policy')}</Link>
                <Link to="/terms">{t('footer.terms')}</Link>
                <Link to="/faq">{t('footer.faq')}</Link>
                <Link to="/contact">{t('nav.contact')}</Link>
              </div>
            </div>
          </Col>

          {/* Download App */}
          <Col xs={24} sm={24} md={24} lg={6}>
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.download_app')}</h3>
              <p className="footer-desc small">{t('footer.save_with_app')}</p>
              <div className="app-download">
                <div className="qr-code">
                  <div className="qr-placeholder">QR</div>
                </div>
                <div className="app-buttons">
                  <div className="app-button">Google Play</div>
                  <div className="app-button">App Store</div>
                </div>
              </div>
              <Space size="middle" className="social-icons">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FacebookOutlined />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <TwitterOutlined />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <InstagramOutlined />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined />
                </a>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
