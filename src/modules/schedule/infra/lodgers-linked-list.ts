import { Lodger } from '../../../shared/domain/entities/lodger.entity';

export interface ILodgerNode {
  lodger: Lodger;
  next: ILodgerNode | null;
}

export const lodgersLinkedList = async (lodgers: Lodger[]) => {
  const build = async (flow: number = 0, node: ILodgerNode | null) => {
    const response: ILodgerNode = { lodger: lodgers[flow], next: node };

    const nxtIteration = flow + 1;
    const nxtNode = lodgers[nxtIteration];
    if (response.next === null) {
      if (nxtNode) {
        response.next = {
          lodger: nxtNode,
          next: null,
        };

        build(nxtIteration, response.next);
      } else {
        return response;
      }
    } else {
      build(nxtIteration, response.next);
    }
  };

  const linkedList = await build(0, null);
  return linkedList;
};
