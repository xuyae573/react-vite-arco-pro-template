import React, { useState, useMemo, useEffect } from 'react';
import { Menu } from '@arco-design/web-react';
import { IconDashboard, IconFile } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import NProgress from 'nprogress';
import useLocale from '@/utils/useLocale';
import styles from '../../style/layout.module.less';
import { getFlattenRoutes } from '@/routes';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

function getIconFromKey(key) {
  switch (key) {
    case 'dashboard':
      return <IconDashboard className={styles.icon} />;
    case 'example':
      return <IconFile className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}

function MenuComponent({
  routes,
  defaultSelectedKeys = [],
  defaultOpenKeys = [],
  topMenu = false,
  className = '',
}) {
  const navigate = useNavigate();
  const locale = useLocale();

  const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  function onClickMenuItem(key) {
    const currentRoute = flattenRoutes.find((r) => r.key === key);
    const component = currentRoute.component;
    const preload = component.preload();
    NProgress.start();
    preload.then(() => {
      navigate(currentRoute.path ? currentRoute.path : `/${key}`);
      NProgress.done();
    });
  }

  function onSubMenuClick(_, openKeys) {
    setOpenKeys(openKeys); // Update open submenu keys
  }

  function renderRoutes(locale) {
    return function travel(_routes) {
      return _routes.map((route) => {
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );

        const visibleChildren = (route.children || []).filter(
          (child) => !child.ignore,
        );

        if (visibleChildren.length) {
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren)}
            </SubMenu>
          );
        }
        return <MenuItem key={route.key}>{titleDom}</MenuItem>;
      });
    };
  }

  useEffect(() => {
    // Only update if defaultSelectedKeys changes (this won't trigger infinite loop)
    if (JSON.stringify(selectedKeys) !== JSON.stringify(defaultSelectedKeys)) {
      setSelectedKeys(defaultSelectedKeys);
    }
  }, [defaultSelectedKeys, selectedKeys]);

  return (
    <Menu
      mode={topMenu ? 'horizontal' : 'vertical'}
      onClickMenuItem={onClickMenuItem}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onClickSubMenu={onSubMenuClick}
      className={className}
    >
      {renderRoutes(locale)(routes)}
    </Menu>
  );
}

export default MenuComponent;
