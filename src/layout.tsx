import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Layout, Breadcrumb, Spin } from '@arco-design/web-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import qs from 'query-string';
import cs from 'classnames';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import useRoute, { getFlattenRoutes } from '@/routes';
import getUrlParams from './utils/getUrlParams';
import { useGlobalStore } from './store';
import styles from './style/layout.module.less';
import MenuComponent from './components/Menu';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';

const Sider = Layout.Sider;
const Content = Layout.Content;

function PageLayout() {
  const urlParams = getUrlParams();
  const location = useLocation();
  const pathname = location.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);

  const { settings, userLoading, userInfo } = useGlobalStore();
  const [routes, defaultRoute] = useRoute(userInfo?.permissions);
  const defaultSelectedKeys = [currentComponent || defaultRoute];

  const [breadcrumb, setBreadCrumb] = useState([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);

  useEffect(() => {
    const routeConfig = flattenRoutes.find((route) => route.key === pathname);
    setBreadCrumb(routeConfig ? [routeConfig.name] : []);
  }, [pathname, flattenRoutes]);

  const toggleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings.menuWidth;

  const showNavbar = settings.navbar && urlParams.navbar !== false;
  const showMenu =
    settings.menu && urlParams.menu !== false && !settings.topMenu;
  const showFooter = settings.footer && urlParams.footer !== false;

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  return (
    <Layout className={styles.layout}>
      <div
        className={cs(styles['layout-navbar'], {
          [styles['layout-navbar-hidden']]: !showNavbar,
        })}
      >
        <Navbar show={showNavbar} defaultSelectedKeys={defaultSelectedKeys} />
      </div>
      {userLoading ? (
        <Spin className={styles['spin']} />
      ) : (
        <Layout>
          {showMenu && (
            <Sider
              className={styles['layout-sider']}
              width={menuWidth}
              collapsed={collapsed}
              onCollapse={setCollapsed}
              trigger={null}
              collapsible
              breakpoint="xl"
              style={paddingTop}
            >
              <div className={styles['menu-wrapper']}>
                <MenuComponent
                  routes={routes}
                  defaultSelectedKeys={defaultSelectedKeys}
                />
              </div>
              <div className={styles['collapse-btn']} onClick={toggleCollapse}>
                {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              </div>
            </Sider>
          )}
          <Layout className={styles['layout-content']} style={paddingStyle}>
            <div className={styles['layout-content-wrapper']}>
              {!!breadcrumb.length && (
                <div className={styles['layout-breadcrumb']}>
                  <Breadcrumb>
                    {breadcrumb.map((node, index) => (
                      <Breadcrumb.Item key={index}>
                        {typeof node === 'string' ? node : node}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                </div>
              )}
              <Content>
                <Routes>
                  {flattenRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={`/${route.key}`}
                      element={<route.component />} // Render the component as a React element
                    />
                  ))}
                </Routes>
              </Content>
            </div>
            {showFooter && <Footer />}
          </Layout>
        </Layout>
      )}
    </Layout>
  );
}

export default PageLayout;
