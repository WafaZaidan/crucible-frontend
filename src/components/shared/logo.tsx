import React, { FC } from 'react';
import { Image } from '@chakra-ui/image';
import { Link } from 'react-router-dom';
import { LinkOverlay, LinkBox } from '@chakra-ui/layout';
import logo from '../../img/logo.png';

type Props = {
  widthList?: number[];
  heightList?: number[];
};

const Logo: FC<Props> = ({
  widthList = ['40px', null, null, '200px'],
  heightList = ['40px', null, null, 'auto'],
}) => {
  return (
    <LinkBox>
      <LinkOverlay as={Link} to='/'>
        <Image
          src={logo}
          width={widthList}
          height={heightList}
          objectFit='cover'
          objectPosition='0% 0'
        />
      </LinkOverlay>
    </LinkBox>
  );
};

export default Logo;
