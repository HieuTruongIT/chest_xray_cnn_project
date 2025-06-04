export function gradeScore(score) {
  if (score === 0) return 'No involvement';
  if (score > 0 && score <= 2) return 'Mild';
  if (score > 2 && score <= 5) return 'Moderate';
  if (score > 5 && score <= 8) return 'Severe';
  return 'Invalid score';
}

export function evaluateSeverity(geographicExtentScore, opacityScore) {
  if (
    geographicExtentScore < 0 || geographicExtentScore > 8 ||
    opacityScore < 0 || opacityScore > 8
  ) {
    return 'Invalid score input';
  }

  const geographicGrade = gradeScore(geographicExtentScore);
  const opacityGrade = gradeScore(opacityScore);

  const levels = ['No involvement', 'Mild', 'Moderate', 'Severe'];
  const geoIndex = levels.indexOf(geographicGrade);
  const opaIndex = levels.indexOf(opacityGrade);

  const overallSeverity = levels[Math.max(geoIndex, opaIndex)];

  return {
    geographicGrade,
    opacityGrade,
    overallSeverity,
  };
}
