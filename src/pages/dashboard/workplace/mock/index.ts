import Mock from 'mockjs';
import setupMock from '@/utils/setupMock';
import { faker } from '@faker-js/faker';

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/workplace/overview-content'), () => {
      const year = new Date().getFullYear();
      const getLineData = () => {
        return new Array(12).fill(0).map((_item, index) => ({
          date: `${year}-${index + 1}`,
          count: Mock.Random.natural(20000, 75000),
        }));
      };
      return {
        allContents: '373.5w+',
        liveContents: '368',
        increaseComments: '8874',
        growthRate: '2.8%',
        chartData: getLineData(),
      };
    });

   

    Mock.mock(new RegExp('/api/workplace/announcement'), () => {
      const generateRandomAnnouncements = () => {
        const types = ['activity', 'info', 'notice'];
        return Array.from({ length: 5 }).map((_, index) => ({
          type: faker.helpers.arrayElement(types),
          key: (index + 1).toString(),
          content: faker.lorem.sentence(),
        }));
      };
    
      return generateRandomAnnouncements();
    });
  },
});
