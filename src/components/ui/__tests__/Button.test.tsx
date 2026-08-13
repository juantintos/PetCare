import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('<Button />', () => {
  it('renderiza el label recibido', () => {
    render(<Button label="Guardar" onPress={() => {}} />);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('ejecuta onPress al presionar', () => {
    const onPress = jest.fn();
    render(<Button label="Guardar" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onPress cuando está en loading (evita doble submit)', () => {
    const onPress = jest.fn();
    render(<Button label="Guardar" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('no ejecuta onPress cuando está disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Guardar" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
