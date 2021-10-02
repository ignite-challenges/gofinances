import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';
import { TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container, 
  Header, 
  Title,
  Content
} from './styles';

import { categories } from '../../utils/categories';

interface CategoryData {
  name: string,
  total: string,
  color: string,
  key: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  
  const loadData = useCallback(async () => {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const expensives = transactions
      .filter((transaction: TransactionCardProps) => 
        transaction.type === 'negative'
      );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionCardProps) => {
        if(expensive.category === category.key)
        categorySum += Number(expensive.amount);
      });

      if(categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total
        });
      }

    });

    setTotalByCategories(totalByCategory);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        {totalByCategories.map(category =>
          <HistoryCard 
            key={category.key}
            title={category.name}
            amount={category.total}
            color={category.color}
          />  
        )}
        </Content>
    </Container>
  );
};

