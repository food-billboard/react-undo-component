import { includeFilter, excludeFilter, ActionTypes } from '../src';
import History from '../src/Component/history';

describe('history util test', function () {
  describe('config test', () => {
    it(`config limit test`, () => {
      let defaultValue = 0;

      const history = new History<number>(
        {
          limit: 5,
        },
        defaultValue,
      );

      new Array(6).fill(0).forEach(() => {
        const prevValue = defaultValue;
        history.enqueue(++defaultValue, prevValue);
      });

      const { past } = history.history;

      expect(past.length).toBe(5);
      expect(past[0]).toBe(1);
    });

    it(`config filter for includeFilter test`, () => {
      const history = new History<number>(
        {
          filter: includeFilter([ActionTypes.ENQUEUE]),
        },
        0,
      );

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(1);
    });

    it(`config filter for excludeFilter test`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.UNDO]),
        },
        0,
      );

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(1);
    });

    it(`config filter for array test`, () => {
      const history = new History<number>(
        {
          filter: [ActionTypes.ENQUEUE],
        },
        0,
      );

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(1);
    });

    it(`config filter for custom filter test`, () => {
      const history = new History<number>(
        {
          filter(action) {
            return action !== ActionTypes.UNDO;
          },
        },
        0,
      );

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(1);
    });

    it(`config debug test`, () => {
      const history = new History<number>({
        debug: true,
      });

      // @ts-ignore
      expect(history.config.debug).toBe(true);
    });

  });

  describe(`util function test`, () => {
    it(`undo test`, () => {
      const history = new History<number>({}, 0);

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(0);
    });

    it(`redo test`, () => {
      const history = new History<number>({}, 0);

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.undo();

      expect(history.state).toEqual(0);

      history.redo();

      expect(history.state).toEqual(1);
    });

    it(`jump test`, () => {
      const history = new History<number>({}, 0);

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.enqueue(2, 1);

      expect(history.state).toEqual(2);

      history.jump(-2);

      expect(history.state).toEqual(0);
    });

    it(`jumpToPast test`, () => {
      const history = new History<number>({}, 0);

      new Array(3).fill(0).forEach((_, index) => {
        history.enqueue(index + 1, index);
        expect(history.state).toEqual(index + 1);
      });

      history.jumpToPast(1);

      expect(history.state).toEqual(1);
    });

    it(`jumpToFuture test`, () => {
      const history = new History<number>({}, 0);

      new Array(3).fill(0).forEach((_, index) => {
        history.enqueue(index + 1, index);
        expect(history.state).toEqual(index + 1);
      });

      history.jumpToPast(1);

      expect(history.state).toEqual(1);

      history.jumpToFuture(1);

      expect(history.state).toEqual(3);
    });

    it(`clear test`, () => {
      const history = new History<number>({}, 0);

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.enqueue(2, 1);

      expect(history.state).toEqual(2);

      history.undo();

      expect(history.state).toEqual(1);

      history.clear();

      history.redo();

      expect(history.state).toEqual(0);
    });

    it(`initState test`, () => {
      const history = new History<number>();

      history.enqueue(1, 0);

      expect(history.state).toEqual(1);

      history.initState(-1);

      history.clear();

      expect(history.state).toEqual(-1);
    });
  });

  it(`multiple action`, () => {
    const history = new History<number>({}, 0);

    new Array(3).fill(0).forEach((_, index) => {
      history.enqueue(index + 1, index);
      expect(history.state).toEqual(index + 1);
    });

    // [0, 1, 2] 3 []

    history.undo();

    expect(history.state).toEqual(2);

    // [0, 1] 2 [3]

    history.redo();

    expect(history.state).toEqual(3);

    // [0, 1, 2] 3 []

    history.jump(-2);

    expect(history.state).toEqual(1);

    // [0] 1 [2, 3]

    history.jump(1);

    expect(history.state).toEqual(2);

    // [0, 1] 2 [3]

    history.undo();

    expect(history.state).toEqual(1);

    // [0] 1 [2, 3]

    history.enqueue(4, history.state as number);

    expect(history.state).toEqual(4);

    // [0, 1] 4 [2, 3]

    history.undo();

    expect(history.state).toEqual(1);

    // [0] 1 [4, 2, 3]

    history.jumpToFuture(1);

    expect(history.state).toEqual(2);
    const { past, future } = history.history;
    expect(past.length).toEqual(3);
    expect(future.length).toEqual(1);

    // [0, 1, 4] 2 [3]
  });

  describe(`not valid action test`, () => {
    it(`undo fail because the past array is empty`, () => {
      const history = new History<number>({}, 0);

      const result = history.undo();

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`undo fail because the filter action is not includes undo`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.UNDO]),
        },
        0,
      );

      history.enqueue(1, 0);

      const result = history.undo();

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`redo fail because the future array is empty`, () => {
      const history = new History<number>({}, 0);

      const result = history.redo();

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`redo fail because the filter action is not includes redo`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.REDO]),
        },
        0,
      );

      history.enqueue(1, 0);

      history.undo();

      const result = history.redo();

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jump fail because the past array is empty`, () => {
      const history = new History<number>({}, 0);

      const result = history.jump(-1);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jump fail because the filter action is not includes jump`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.JUMP]),
        },
        0,
      );

      history.enqueue(1, 0);

      const result = history.jump(-1);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jump fail because the index set 0`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.JUMP]),
        },
        0,
      );

      history.enqueue(1, 0);

      const result = history.jump(0);

      expect(history.isActionDataValid(result)).toBeFalsy();

      expect(history.state).toEqual(1)

    })

    it(`jumpToFuture fail because the future array is empty`, () => {
      const history = new History<number>({}, 0);

      const result = history.jumpToFuture(0);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jumpToFuture fail because the filter action is not includes jumpToFuture`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.JUMP_TO_FUTURE]),
        },
        0,
      );

      history.enqueue(1, 0);

      history.undo()

      const result = history.jumpToFuture(0);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jumpToPast fail because the past array is empty`, () => {
      const history = new History<number>({}, 0);

      const result = history.jumpToPast(0);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`jumpToPast fail because the filter action is not includes jumpToPast`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.JUMP_TO_PAST]),
        },
        0,
      );

      history.enqueue(1, 0);

      const result = history.jumpToPast(0);

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

    it(`clear fail because the filter action is not includes clear`, () => {
      const history = new History<number>(
        {
          filter: excludeFilter([ActionTypes.CLEAR_HISTORY]),
        },
        0,
      );

      history.enqueue(1, 0);

      const result = history.clear();

      expect(history.isActionDataValid(result)).toBeFalsy();
    });

  });
});
