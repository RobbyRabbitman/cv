/** @param {import('karma').Config} config */
module.exports = async function (config) {
  const { karmaConfigAngular } = await import(
    '@robby-rabbitman/cv-tools-karma'
  );
  karmaConfigAngular(config);
};
