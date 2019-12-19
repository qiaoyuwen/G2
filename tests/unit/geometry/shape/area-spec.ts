import { getCoordinate } from '../../../../src/dependents';
import Element from '../../../../src/geometry/element/index';
import AreaShapeFactory from '../../../../src/geometry/shape/area';
import Theme from '../../../../src/theme/antv';
import { createCanvas, createDiv, removeDom } from '../../../util/dom';

import 'jest-extended';

const Rect = getCoordinate('rect');

describe('Area shapes', () => {
  const div = createDiv();
  const canvas = createCanvas({
    container: div,
    width: 500,
    height: 500,
  });
  const rectCoord = new Rect({
    start: { x: 0, y: 500 },
    end: { x: 500, y: 0 },
  });
  AreaShapeFactory.coordinate = rectCoord;
  AreaShapeFactory.theme = Theme.geometries.area;

  const element = new Element({
    shapeType: 'area',
    shapeFactory: AreaShapeFactory,
    container: canvas.addGroup(),
    theme: Theme.geometries.area,
  });

  it('defaultShapeType', () => {
    expect(AreaShapeFactory.defaultShapeType).toBe('area');
  });

  it('getDefaultPoints()', () => {
    const pointInfo1 = {
      x: 1,
      y: [0, 1],
    };
    expect(AreaShapeFactory.getDefaultPoints(pointInfo1)).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);

    const pointInfo2 = {
      x: 1,
      y: 1,
      y0: 0.5,
    };
    expect(AreaShapeFactory.getDefaultPoints(pointInfo2)).toEqual([
      { x: 1, y: 0.5 },
      { x: 1, y: 1 },
    ]);
  });

  it('getMarker()', () => {
    const areaMarker = AreaShapeFactory.getMarker('area', {
      color: 'red',
      isInPolar: false,
    });
    expect(areaMarker.fill).toBe('red');
    expect(areaMarker.symbol).toBeFunction();

    const lineMarker = AreaShapeFactory.getMarker('line', {
      color: 'red',
      isInPolar: false,
    });
    expect(lineMarker.stroke).toBe('red');
    expect(lineMarker.symbol).toBeFunction();

    const smoothMarker = AreaShapeFactory.getMarker('smooth', {
      color: 'red',
      isInPolar: false,
    });
    expect(smoothMarker.fill).toBe('red');
    expect(smoothMarker.symbol).toBeFunction();

    const smoothLineMarker = AreaShapeFactory.getMarker('smoothLine', {
      color: 'red',
      isInPolar: false,
    });
    expect(smoothLineMarker.stroke).toBe('red');
    expect(smoothLineMarker.symbol).toBeFunction();
  });

  describe('area', () => {
    // @ts-ignore
    element.shapeType = 'area';
    it('draw', () => {
      const shape = AreaShapeFactory.drawShape(
        'area',
        {
          x: 100,
          y: 100,
          defaultStyle: {
            ...Theme.geometries.area.area.default,
          },
          style: {
            fill: 'red',
          },
          points: [
            [
              { x: 0, y: 0.48 },
              { x: 0, y: 0.88 },
            ],
            [
              { x: 0.5, y: 0.26 },
              { x: 0.5, y: 0.62 },
            ],
            [
              { x: 1, y: 0.04 },
              { x: 1, y: 0.52 },
            ],
          ],
        },
        element.container
      );
      // canvas.draw();
      expect(shape.attr('fill')).toBe('red');
      expect(shape.attr('path').length).toBe(7);
    });
  });

  describe('line', () => {
    // @ts-ignore
    element.shapeType = 'line';
    it('draw, points contain empty', () => {
      const shape = AreaShapeFactory.drawShape(
        'line',
        {
          x: 100,
          y: 100,
          defaultStyle: {
            ...Theme.geometries.area.line.default,
          },
          points: [
            [
              { x: 0, y: 0.48 },
              { x: 0, y: 0.88 },
            ],
            [
              { x: 0.25, y: 0.26 },
              { x: 0.25, y: 0.62 },
            ],
            [
              { x: 0.5, y: 0 },
              { x: 0.5, y: null },
            ],
            [
              { x: 0.75, y: 0.08 },
              { x: 0.75, y: 0.56 },
            ],
            [
              { x: 1, y: 0.08 },
              { x: 1, y: 0.56 },
            ],
          ],
          connectNulls: false,
        },
        element.container
      );
      // canvas.draw();
      expect(shape.attr('stroke')).toBe(Theme.defaultColor);
      expect(shape.attr('path').length).toBe(10);
      expect(shape.attr('path')[5][0]).toBe('M');
    });
  });

  describe('smooth', () => {
    // @ts-ignore
    element.shapeType = 'smooth';
    it('draw', () => {
      const shape = AreaShapeFactory.drawShape(
        'smooth',
        {
          x: 100,
          y: 100,
          defaultStyle: {
            ...Theme.geometries.area.smooth.default,
          },
          points: [
            [
              { x: 0, y: 0.48 },
              { x: 0, y: 0.88 },
            ],
            [
              { x: 0.5, y: 0.26 },
              { x: 0.5, y: 0.62 },
            ],
            [
              { x: 1, y: 0.04 },
              { x: 1, y: 0.52 },
            ],
          ],
        },
        element.container
      );
      // canvas.draw();
      expect(shape.attr('fill')).toBe(Theme.defaultColor);
      expect(shape.attr('path').length).toBe(7);
      expect(shape.attr('path')[1].length).toBe(7);
      expect(shape.attr('path')[3].length).toBe(3);
    });
  });

  describe('smoothLine', () => {
    // @ts-ignore
    element.shapeType = 'smoothLine';
    it('draw', () => {
      const shape = AreaShapeFactory.drawShape(
        'smoothLine',
        {
          x: 100,
          y: 100,
          defaultStyle: {
            ...Theme.geometries.area.smoothLine.default,
          },
          style: {
            stroke: 'red',
          },
          points: [
            [
              { x: 0, y: 0.48 },
              { x: 0, y: 0.88 },
            ],
            [
              { x: 0.5, y: 0.26 },
              { x: 0.5, y: 0.62 },
            ],
            [
              { x: 1, y: 0.04 },
              { x: 1, y: 0.52 },
            ],
          ],
          color: 'yellow',
        },
        element.container
      );
      // canvas.draw();
      expect(shape.attr('stroke')).toBe('red');
      expect(shape.attr('path').length).toBe(7);
      expect(shape.attr('path')[1].length).toBe(7);
      expect(shape.attr('path')[3].length).toBe(3);
    });
  });

  afterAll(() => {
    canvas.destroy();
    removeDom(div);
  });
});