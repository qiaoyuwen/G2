import { getCoordinate } from '../../../../src/dependents';
import Element from '../../../../src/geometry/element/index';
import PointShapeFactory from '../../../../src/geometry/shape/point';
import Theme from '../../../../src/theme/antv';
import { createCanvas, createDiv, removeDom } from '../../../util/dom';

const Rect = getCoordinate('rect');
const SHAPES = ['circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangleDown'];
const HOLLOW_SHAPES = ['cross', 'tick', 'plus', 'hyphen', 'line'];

describe('Point shapes', () => {
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
  PointShapeFactory.coordinate = rectCoord;
  PointShapeFactory.theme = Theme.geometries.point;

  const element = new Element({
    shapeType: 'point',
    shapeFactory: PointShapeFactory,
    container: canvas.addGroup(),
    theme: Theme.geometries.point,
  });

  it('defaultShapeType', () => {
    expect(PointShapeFactory.defaultShapeType).toBe('circle');
  });

  it('getShapes', () => {
    SHAPES.forEach((shape) => {
      expect(PointShapeFactory.getShape(shape)).not.toBe(undefined);
    });

    HOLLOW_SHAPES.forEach((shape) => {
      expect(PointShapeFactory.getShape(shape)).not.toBe(undefined);
    });
  });

  it('getShapePoints', () => {
    const point = PointShapeFactory.getShapePoints('tick', {
      x: 0.4,
      y: 0.8,
    });
    expect(point[0].x).toBe(0.4);
    expect(point[0].y).toBe(0.8);
  });

  it('getMarker', () => {
    const circleMarker = PointShapeFactory.getMarker('circle', { color: 'red', isInPolar: false });
    expect(circleMarker).toEqual({
      symbol: 'circle',
      style: {
        ...Theme.geometries.point.circle.default,
        r: 4.5,
        fill: 'red',
      },
    });

    const hollowCircleMarker = PointShapeFactory.getMarker('hollowCircle', { color: 'red', isInPolar: false });
    expect(hollowCircleMarker).toEqual({
      symbol: 'circle',
      style: {
        ...Theme.geometries.point.hollowCircle.default,
        r: 4.5,
        stroke: 'red',
      },
    });

    const bowtieMarker = PointShapeFactory.getMarker('bowtie', { color: 'red', isInPolar: false });
    // @ts-ignore
    expect(bowtieMarker.symbol(11.5, 10, 3.5)).toEqual([['M', 8, 8], ['L', 15, 12], ['L', 15, 8], ['L', 8, 12], ['Z']]);
    expect(bowtieMarker.style.fill).toBe('red');

    const crossMarker = PointShapeFactory.getMarker('cross', { color: 'red', isInPolar: false });
    // @ts-ignore
    expect(crossMarker.symbol(10, 10, 5)).toEqual([
      ['M', 5, 5],
      ['L', 15, 15],
      ['M', 15, 5],
      ['L', 5, 15],
    ]);
    expect(crossMarker.style.stroke).toBe('red');
  });

  it('draw shapes', () => {
    const shape = PointShapeFactory.drawShape(
      'circle',
      {
        x: 100,
        y: 100,
        points: [{ x: 100, y: 100 }],
        color: 'red',
        defaultStyle: {
          ...Theme.geometries.point.circle.default,
        },
      },
      element.container
    );
    expect(shape.attr('symbol')).toBe('circle');
    expect(shape.attr('fill')).toBe('red');
  });

  it('draw hollow shapes', () => {
    const shape = PointShapeFactory.drawShape(
      'hyphen',
      {
        x: 100,
        y: 100,
        points: [{ x: 100, y: 100 }],
        color: 'red',
        defaultStyle: {
          ...Theme.geometries.point.hyphen.default,
        },
      },
      element.container
    );

    expect(shape.attr('symbol')).toBe('hyphen');
    expect(shape.attr('stroke')).toBe('red');
  });

  it('draw image point', () => {
    const shape = PointShapeFactory.drawShape(
      'image',
      {
        x: 100,
        y: 100,
        points: [{ x: 100, y: 100 }],
        color: 'red',
        size: 40,
        shape: ['image', 'hh'],
        defaultStyle: {
          ...Theme.geometries.point.circle.default,
        },
      },
      element.container
    );

    expect(shape.get('type')).toBe('image');
    expect(shape.attr('x')).toBe(80);
    expect(shape.attr('y')).toBe(60);
    expect(shape.attr('width')).toBe(40);
    expect(shape.attr('height')).toBe(40);
    expect(shape.attr('img')).toBe('hh');
  });

  afterAll(() => {
    canvas.destroy();
    removeDom(div);
  });
});