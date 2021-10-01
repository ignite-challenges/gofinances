import React, { useCallback } from 'react';

import { 
  Container,
  Header,
  Title,
  CategoryList,
  Category,
  Icon,
  Name,
  Separator,
  Footer
} from './styles';

import { Button } from '../../components/Form/Button';

import { categories } from '../../utils/categories';

interface CategoryProps {
  key: string;
  name: string;
}

interface Props {
  category: CategoryProps;
  setCategory: (category: CategoryProps) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({ 
  category, 
  setCategory,
  closeSelectCategory
}: Props) {
  const handleCategorySelect = useCallback((category: CategoryProps) => {
    setCategory(category)
  }, [])

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      <CategoryList
        data={categories}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={()=> handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  )
}