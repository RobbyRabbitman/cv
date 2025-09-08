/** @param {import('karma').Config} config */
module.exports = async function (config) {
  const { angularKarmaConfig } = await import(
    '@robby-rabbitman/cv-tools-karma'
  );
  config.set(angularKarmaConfig());
};
