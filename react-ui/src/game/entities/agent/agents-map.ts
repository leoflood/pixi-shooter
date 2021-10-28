import Char1 from './char1';
import Char1Clone from './char1-clone';
import Char2 from './char2';
import Char3 from './char3';

const agentsMap = {
  char1: Char1,
  'char1-clone': Char1Clone,
  char2: Char2,
  char3: Char3,
};

export type agentKey = keyof typeof agentsMap;

export default agentsMap;
