import React, { ReactNode } from 'react';
import {
  Switch,
  Divider,
  InputNumber,
  Radio,
  Button,
} from '@arco-design/web-react';

import { useGlobalStore } from '../../store';
import useLocale from '../../utils/useLocale';
import styles from './style/block.module.less';

export interface BlockProps {
  title?: ReactNode;
  options?: {
    name: string;
    value: string;
    selectOptions?: string[];
    type?: 'switch' | 'number' | 'radio';
  }[];
  children?: ReactNode;
}

export default function Block(props: BlockProps) {
  const { title, options, children } = props;
  const locale = useLocale();
  const { settings, updateSettings } = useGlobalStore();

  return (
    <div className={styles.block}>
      <h5 className={styles.title}>{title}</h5>
      {options &&
        options.map((option) => {
          const type = option.type || 'switch';

          return (
            <div className={styles['switch-wrapper']} key={option.value}>
              <span>{locale[option.name]}</span>
              {type === 'switch' && (
                <Switch
                  size="small"
                  checked={!!settings[option.value]}
                  onChange={(checked) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: checked,
                    };
                    updateSettings(newSetting);
                    // set color week
                    if (checked && option.value === 'colorWeek') {
                      document.body.style.filter = 'invert(80%)';
                    }
                    if (!checked && option.value === 'colorWeek') {
                      document.body.style.filter = 'none';
                    }
                  }}
                />
              )}
              {type === 'number' && (
                <InputNumber
                  style={{ width: 80 }}
                  size="small"
                  value={settings.menuWidth}
                  onChange={(value) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: value,
                    };
                    updateSettings(newSetting);
                  }}
                />
              )}
              {type === 'radio' && (
                <Radio.Group
                  defaultValue={option.value}
                  name="button-radio-group"
                >
                  {option.selectOptions.map((item) => {
                    return (
                      <Radio key={item} value={item}>
                        {({ checked }) => {
                          return (
                            <Button
                              tabIndex={-1}
                              key={item}
                              shape="round"
                              type={checked ? 'primary' : 'default'}
                              onChange={(value) => {
                                const newSetting = {
                                  ...settings,
                                  [option.value]: value,
                                };
                                updateSettings(newSetting);
                              }}
                            >
                              {item}
                            </Button>
                          );
                        }}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              )}
            </div>
          );
        })}
      {children}
      <Divider />
    </div>
  );
}
