import React from 'react';
import { Content, Wrapper } from './style';

const Modal = ({
  children,
  setOpen,
}: {
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Wrapper onClick={() => setOpen(false)}>
      <Content onClick={(e) => e.stopPropagation()}>{children}</Content>
    </Wrapper>
  );
};

export default Modal;
