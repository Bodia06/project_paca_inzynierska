const normalizeModuleString = modulName => {
  if (!modulName || typeof modulName !== 'string') return modulName;

  const technologies = modulName.split(',');

  const cleanedTechnologies = technologies
    .map(tech => {
      const cleanTech = tech.trim().replace(/\s+/g, ' ');
      if (!cleanTech) return null;
      return cleanTech
        .split(' ')
        .map(word => {
          if (/^[+\-.#]+$/.test(word)) return word;

          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    })
    .filter(Boolean);

  const uniqueTechnologies = [...new Set(cleanedTechnologies)];

  uniqueTechnologies.sort((a, b) => a.localeCompare(b));

  return uniqueTechnologies.join(', ');
};

const normalizeTaskModule = (req, res, next) => {
  if (req.body && req.body.modul) {
    req.body.modul = normalizeModuleString(req.body.modul);
  }

  if (req.query && req.query.modul) {
    req.query.modul = normalizeModuleString(req.query.modul);
  }

  next();
};

module.exports = {
  normalizeTaskModule,
};
