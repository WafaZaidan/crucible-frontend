import { ReactElement } from 'react';
import { Flag, useFeatureFlag } from '../../store/featureFlag';

type Props = {
  name: Flag;
  children: ReactElement;
};

const Feature: React.FC<Props> = ({ name, children }) => {
  const { featureFlag } = useFeatureFlag();

  const isActive = featureFlag[name] === true;

  if (isActive) {
    return children;
  }

  return null;
};

export default Feature;
