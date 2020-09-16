import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    // TODO RETURN THE SUM OF THE PRICE FROM ALL ITEMS IN THE CART
    const price: number[] = [];
    const initialValue = 0;

    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    products.forEach(product => {
      if (product.quantity) {
        const productTotal = product.price * product.quantity;
        price.push(productTotal);
      }
    });

    const priceTotal = price.reduce(reducer, initialValue);

    return formatValue(priceTotal);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const initialValue = 0;
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const productsQuantity = products.map(item => item.quantity);

    const productsTotal = productsQuantity.reduce(reducer, initialValue);

    return productsTotal;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
