import React, { FC } from 'react';
import { Image } from '@chakra-ui/image';
import { Link } from 'react-router-dom';
import { LinkOverlay, LinkBox } from '@chakra-ui/layout';
import logo from '../../img/logo.png';

type Props = {
  widthList?: number[];
};

const Logo: FC<Props> = ({ widthList = ['140px', '140px', '200px'] }) => {
  return (
    <LinkBox>
      <LinkOverlay as={Link} to='/'>
        <Image src={logo} width={widthList} alt='alchemist logo' />
      </LinkOverlay>
    </LinkBox>
  );
};

export default Logo;
