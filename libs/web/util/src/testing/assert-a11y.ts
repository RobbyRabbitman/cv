import axe, { type ElementContext, type RunOptions } from 'axe-core';

/**
 * Asserts that the given element has no accessibility violations using `axe`.
 *
 * @see {@link https://github.com/dequelabs/axe-core axe}
 */
export async function assertA11y(
  element: ElementContext,
  options?: RunOptions,
) {
  const a11y = await axe.run(element, options ?? {});

  if (a11y.violations.length > 0) {
    throw new Error(
      a11y.violations
        .map(
          (violation) =>
            `[${violation.id}](${violation.nodes.length} ${violation.nodes.length > 1 ? 'nodes' : 'node'}): ${violation.description} - ${violation.help} ${violation.helpUrl} `,
        )
        .join('\n'),
    );
  }
}
