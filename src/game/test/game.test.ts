import Char1 from '../entities/agent/char1';
import Char2 from '../entities/agent/char2';
import { ItemMoney } from '../entities/item/items';
import Game from '../game';
import Vector2D from '../utils/vector-2d';

describe('Game suite', () => {
  describe('hurtAgent && healAgent', () => {
    it('Case 1', () => {
      const game = new Game({
        width: 800,
        height: 600,
        levelKey: 'level1',
      });

      const agent = new Char1({ team: 1, position: new Vector2D(0, 0) });

      game.addAgent(agent);
      game.hurtAgent(agent, 50); // Necessary

      const currentAgentHp = agent.hp;
      game.healAgent(agent, 10);

      expect(agent.hp).toBe(currentAgentHp + 10);
    });

    it('Agents cannot get less than 0 hp', () => {
      const game = new Game({
        width: 800,
        height: 600,
        levelKey: 'level1',
      });

      const agent = new Char1({ team: 1, position: new Vector2D(0, 0) });
      agent.hp = 50;

      game.addAgent(agent);
      game.hurtAgent(agent, 100);

      expect(agent.hp).toBe(0);
    });

    it('Agents cannot get more hp than his max hp', () => {
      const game = new Game({
        width: 800,
        height: 600,
        levelKey: 'level1',
      });

      const agent = new Char1({ team: 1, position: new Vector2D(0, 0) });
      agent.hp = 50;
      agent.maxHp = 75;

      game.addAgent(agent);
      game.healAgent(agent, 100);

      expect(agent.hp).toBe(75);
    });

    it('Enemy will earn the correclty damage done', () => {
      const game = new Game({
        width: 800,
        height: 600,
        levelKey: 'level1',
      });

      const agent = new Char1({ team: 1, position: new Vector2D(0, 0) });
      agent.hp = 50;

      const enemy = new Char2({ team: 2, position: new Vector2D(0, 0) });

      game.addAgent(agent);
      game.hurtAgent(agent, 100, enemy);

      // His damage done property must be 50, not 100 like his damage because his target had only 50 hp
      expect(enemy.damageDone).toBe(50);
    });
  });

  describe('Items', () => {
    describe('addItem && removeItem', () => {
      test('Case 1', () => {
        const game = new Game({
          width: 800,
          height: 600,
          levelKey: 'level1',
        });

        expect(game.items.length).toBe(0);

        const item = new ItemMoney({
          team: 1,
          position: new Vector2D(200, 200),
        });

        game.addItem(item);

        expect(game.items.length).toBe(1);

        game.removeItem(item);

        expect(game.items.length).toBe(0);
      });
    });

    describe('ItemMoney', () => {
      test('ItemMoney should not heal more than agent max hp', () => {
        const game = new Game({
          width: 800,
          height: 600,
          levelKey: 'level1',
        });

        const agent = new Char1({ team: 1, position: new Vector2D(0, 0) });

        game.addAgent(agent);
        game.hurtAgent(agent, 55);

        expect(agent.hp).toBe(agent.maxHp - 55);

        const item = new ItemMoney({
          team: 1,
          position: new Vector2D(200, 200),
        });

        game.addItem(item);
        game.collectItem(agent, item);

        expect(agent.hp).toBe(agent.maxHp);
      });
    });
  });
});
