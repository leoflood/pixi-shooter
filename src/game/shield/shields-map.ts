import ShieldProjectileReflector from './shield-projectile-reflector';

const shieldsMap = {
  'shield-projectile-reflector': ShieldProjectileReflector,
};

export type shieldKey = keyof typeof shieldsMap;

export default shieldsMap;
