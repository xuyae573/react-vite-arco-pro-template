import React from 'react';
import { Trigger, Typography } from '@arco-design/web-react';
import { SketchPicker } from 'react-color';
import { generate, getRgbStr } from '@arco-design/color';
import { useGlobalStore } from '../../store';
import useLocale from '@/utils/useLocale';
import styles from './style/color-panel.module.less';

function ColorPanel() {
  // Access settings and updateSettings from the global store
  const { settings, updateSettings } = useGlobalStore();

  // Use default parameters for destructuring
  const { theme = 'light', themeColor = '#1890ff' } = settings || {}; // Destructure with defaults if settings is undefined

  const locale = useLocale();
  const list = generate(themeColor, { list: true });

  return (
    <div>
      <Trigger
        trigger="hover"
        position="bl"
        popup={() => (
          <SketchPicker
            color={themeColor}
            onChangeComplete={(color) => {
              const newColor = color.hex;

              // Update settings with the new theme color
              updateSettings({ ...settings, themeColor: newColor });
              const newList = generate(newColor, {
                list: true,
                dark: theme === 'dark',
              });
              newList.forEach((l, index) => {
                const rgbStr = getRgbStr(l);
                document.body.style.setProperty(
                  `--arcoblue-${index + 1}`,
                  rgbStr,
                );
              });
            }}
          />
        )}
      >
        <div className={styles.input}>
          <div
            className={styles.color}
            style={{ backgroundColor: themeColor }}
          />
          <span>{themeColor}</span>
        </div>
      </Trigger>
      <ul className={styles.ul}>
        {list.map((item, index) => (
          <li
            key={index}
            className={styles.li}
            style={{ backgroundColor: item }}
          />
        ))}
      </ul>
      <Typography.Paragraph style={{ fontSize: 12 }}>
        {locale['settings.color.tooltip']}
      </Typography.Paragraph>
    </div>
  );
}

export default ColorPanel;
