import { AstNode, NodeType } from '../parser/ast.js';

export type LimitCb = (result: LimitResult, skipped: number, front: boolean) => void;
export interface LimitResult {
  skippedFront: number;
  skippedBack: number;
  nodes: AstNode[];
}

export function limitWithComment(result: LimitResult, skipped: number, front: boolean) {
  if (!skipped) {
    return;
  }

  result.nodes.push({
    type: NodeType.block_comment,
    text: `/* ${front ? `${skipped} more items ...` : `... ${skipped} more items`} */`,
    precedingWhitespace: '',
  });
}

export function limitNodesByType(
  nodes: AstNode[],
  type: NodeType,
  cbIfSkipped: LimitCb,
  start: number,
  end?: number
) {
  const buffer: AstNode[] = [];
  const result: LimitResult = {
    skippedFront: 0,
    skippedBack: 0,
    nodes: [],
  };
  let hitCurrType = 0;
  // We want to start taking a piece
  let grub = false;

  if (start === 0 && (end === undefined || end >= nodes.length)) {
    return {
      skippedFront: 0,
      skippedBack: 0,
      nodes,
    };
  }

  for (let i = start; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type !== type) {
      if (grub) {
        buffer.push(node);
      }

      continue;
    }

    if (hitCurrType < start) {
      hitCurrType++;
      continue;
    } else {
      if (!grub) {
        result.skippedFront = hitCurrType;
        cbIfSkipped(result, hitCurrType, true);
      }

      grub = true;
    }

    if (end !== undefined && hitCurrType >= end) {
      const sumToEnd = nodes.slice(i).reduce((acc, n) => acc + (n.type === type ? 1 : 0), 0);
      result.skippedBack = sumToEnd;
      cbIfSkipped(result, sumToEnd, false);
      break;
    }

    hitCurrType++;
    result.nodes.push(...buffer, node);
    buffer.length = 0;
  }

  return result;
}
