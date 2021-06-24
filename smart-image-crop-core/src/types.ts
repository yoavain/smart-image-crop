import type { labels } from "./labels";

enum BBOX {
    detection_box = "detection_box",
    bbox = "bbox"
}

type Box = [x1: number, y1: number, x2: number, y2: number];
type BoundaryBox = { [BBOX.bbox]: Box } | { [BBOX.detection_box]: Box };
type Label = typeof labels[0];

export type ImageAnnotation = BoundaryBox & { label: Label, score: number }
