export function getDegreesFromPerc(percentage) {
    return percentage * 360;
}

export function getRadiansFromDegrees(degrees) {
    return degrees / 180 * Math.PI;  // alternatively return degrees / 360 * 2 * Math.PI;
}

export function getCoordsFromRadians(angleInRadians, radius, svgSize) {
    /* taken from https://dev.to/mustapha/how-to-create-an-interactive-svg-donut-chart-using-angular-19eo */

    const xScale = Math.sin(angleInRadians);
    const yScale = -Math.cos(angleInRadians);
    const xCoord = (svgSize / 2) + (radius * xScale);
    const yCoord = (svgSize / 2) + (radius * yScale);

    return [xCoord, yCoord];
}

export function getOutterArcString(xEnd, yEnd, radius, angleInRadians) {
    let largeArcFlag = 0;
    let sweepFlag = 1;

    if (angleInRadians >= Math.PI) {
        largeArcFlag = 1;
    }

    return `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${xEnd} ${yEnd}`;
}

export function getInterpolatedValue(percentage, minValue, maxValue) {
    const perc = Math.min(percentage, 0.9999);
    return minValue + (maxValue - minValue) * perc;
}

export function getInterpolatedCoords(percentage, xMinCoord, yMinCoord, xMaxCoord, yMaxCoord) {
    const xCoord = getInterpolatedValue(percentage, xMinCoord, xMaxCoord);
    const yCoord = getInterpolatedValue(percentage, yMinCoord, yMaxCoord);

    return [xCoord, yCoord];
}
