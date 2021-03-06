/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {GRID_LAYER_TEMPLATE_CLASS_NAMES} from './amp-story-grid-layer';
import {StoryAnimationPresetDef} from './animation-types';
import {
  calculateTargetScalingFactor,
  rotateAndTranslate,
  scaleAndTranslate,
  translate2d,
  whooshIn,
} from './animation-presets-utils';
import {px} from '../../../src/style';
import {userAssert} from '../../../src/log';

/** @const {string} */
const FULL_BLEED_CATEGORY = 'full-bleed';
/** @const {string} */
const FILL_TEMPLATE_LAYOUT = 'fill';
/** @const {number} */
const SCALE_HIGH_DEFAULT = 3;
/** @const {number} */
const SCALE_LOW_DEFAULT = 1;

/**
 * A list of animations that are full bleed.
 * @private @const {!Array<string>}
 */
const FULL_BLEED_ANIMATION_NAMES = [
  'pan-up',
  'pan-down',
  'pan-right',
  'pan-left',
  'zoom-in',
  'zoom-out',
];

/**
 * A mapping of animation categories to corresponding CSS class names.
 * @private @const {!Object<string, string>}
 */
const ANIMATION_CSS_CLASS_NAMES = {
  [FULL_BLEED_CATEGORY]:
    'i-amphtml-story-grid-template-with-full-bleed-animation',
};

/**
 * Perform style-specific operations for presets.
 * @param {!Element} el
 * @param {string} presetName
 */
export function setStyleForPreset(el, presetName) {
  // For full bleed animations.
  if (FULL_BLEED_ANIMATION_NAMES.indexOf(presetName) >= 0) {
    const parent = el.parentElement;
    if (
      parent.classList.contains(
        GRID_LAYER_TEMPLATE_CLASS_NAMES[FILL_TEMPLATE_LAYOUT]
      )
    ) {
      parent.classList.remove(
        GRID_LAYER_TEMPLATE_CLASS_NAMES[FILL_TEMPLATE_LAYOUT]
      );
    }
    parent.classList.add(ANIMATION_CSS_CLASS_NAMES[FULL_BLEED_CATEGORY]);
  }
}

/**
 * @param {string} name
 * @param {!Object} options
 * @return {?StoryAnimationPresetDef}
 */
// First keyframe will always be considered offset: 0 and will be applied to the
// element as the first frame before animation starts.
export const getPresetDef = (name, options) => {
  switch (name) {
    case 'pulse':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        keyframes: [
          {
            offset: 0,
            transform: 'scale(1)',
          },
          {
            offset: 0.25,
            transform: 'scale(0.95)',
          },
          {
            offset: 0.75,
            transform: 'scale(1.05)',
          },
          {
            offset: 1,
            transform: 'scale(1)',
          },
        ],
      };
    case 'fly-in-left':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = -(dimensions.targetX + dimensions.targetWidth);
          return translate2d(offsetX, 0, 0, 0);
        },
      };
    case 'fly-in-right':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = dimensions.pageWidth - dimensions.targetX;
          return translate2d(offsetX, 0, 0, 0);
        },
      };
    case 'fly-in-top':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetY = -(dimensions.targetY + dimensions.targetHeight);
          return translate2d(0, offsetY, 0, 0);
        },
      };
    case 'fly-in-bottom':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetY = dimensions.pageHeight - dimensions.targetY;
          return translate2d(0, offsetY, 0, 0);
        },
      };
    case 'rotate-in-left':
      return {
        duration: 600,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = -(dimensions.targetX + dimensions.targetWidth);
          return rotateAndTranslate(offsetX, 0, 0, 0, -1);
        },
      };
    case 'rotate-in-right':
      return {
        duration: 600,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = dimensions.pageWidth - dimensions.targetX;
          return rotateAndTranslate(offsetX, 0, 0, 0, 1);
        },
      };
    case 'fade-in':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
      };
    case 'drop':
      return {
        duration: 1600,
        keyframes(dimensions) {
          const maxBounceHeight = Math.max(
            160,
            dimensions.targetY + dimensions.targetHeight
          );

          return [
            {
              offset: 0,
              transform: `translateY(${px(-maxBounceHeight)})`,
              easing: 'cubic-bezier(.75,.05,.86,.08)',
            },
            {
              offset: 0.3,
              transform: 'translateY(0)',
              easing: 'cubic-bezier(.22,.61,.35,1)',
            },
            {
              offset: 0.52,
              transform: `translateY(${px(-0.6 * maxBounceHeight)})`,
              easing: 'cubic-bezier(.75,.05,.86,.08)',
            },
            {
              offset: 0.74,
              transform: 'translateY(0)',
              easing: 'cubic-bezier(.22,.61,.35,1)',
            },
            {
              offset: 0.83,
              transform: `translateY(${px(-0.3 * maxBounceHeight)})`,
              easing: 'cubic-bezier(.75,.05,.86,.08)',
            },
            {
              offset: 1,
              transform: 'translateY(0)',
              easing: 'cubic-bezier(.22,.61,.35,1)',
            },
          ];
        },
      };
    case 'twirl-in':
      return {
        duration: 1000,
        easing: 'cubic-bezier(.2,.75,.4,1)',
        keyframes: [
          {
            transform: 'rotate(-540deg) scale(0.1)',
            opacity: 0,
          },
          {
            transform: 'none',
            opacity: 1,
          },
        ],
      };
    case 'whoosh-in-left':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = -(dimensions.targetX + dimensions.targetWidth);
          return whooshIn(offsetX, 0, 0, 0);
        },
      };
    case 'whoosh-in-right':
      return {
        duration: 400,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        keyframes(dimensions) {
          const offsetX = dimensions.pageWidth - dimensions.targetX;
          return whooshIn(offsetX, 0, 0, 0);
        },
      };
    case 'pan-left':
      let {translateX} = options;

      return {
        duration: 1000,
        easing: 'linear',
        keyframes(dimensions) {
          const scalingFactor = calculateTargetScalingFactor(dimensions);
          dimensions.targetWidth *= scalingFactor;
          dimensions.targetHeight *= scalingFactor;

          const offsetX = dimensions.pageWidth - dimensions.targetWidth;
          const offsetY = (dimensions.pageHeight - dimensions.targetHeight) / 2;

          return scaleAndTranslate(
            offsetX,
            offsetY,
            translateX ? offsetX + translateX : 0,
            offsetY,
            scalingFactor
          );
        },
      };
    case 'pan-right':
      translateX = options.translateX;

      return {
        duration: 1000,
        easing: 'linear',
        keyframes(dimensions) {
          const scalingFactor = calculateTargetScalingFactor(dimensions);
          dimensions.targetWidth *= scalingFactor;
          dimensions.targetHeight *= scalingFactor;

          const offsetX = dimensions.pageWidth - dimensions.targetWidth;
          const offsetY = (dimensions.pageHeight - dimensions.targetHeight) / 2;

          return scaleAndTranslate(
            0,
            offsetY,
            -translateX || offsetX,
            offsetY,
            scalingFactor
          );
        },
      };
    case 'pan-down':
      let {translateY} = options;

      return {
        duration: 1000,
        easing: 'linear',
        keyframes(dimensions) {
          const scalingFactor = calculateTargetScalingFactor(dimensions);
          dimensions.targetWidth *= scalingFactor;
          dimensions.targetHeight *= scalingFactor;

          const offsetX = -dimensions.targetWidth / 2;
          const offsetY = dimensions.pageHeight - dimensions.targetHeight;

          return scaleAndTranslate(
            offsetX,
            0,
            offsetX,
            -translateY || offsetY,
            scalingFactor
          );
        },
      };
    case 'pan-up':
      translateY = options.translateY;

      return {
        duration: 1000,
        easing: 'linear',
        keyframes(dimensions) {
          const scalingFactor = calculateTargetScalingFactor(dimensions);
          dimensions.targetWidth *= scalingFactor;
          dimensions.targetHeight *= scalingFactor;

          const offsetX = -dimensions.targetWidth / 2;
          const offsetY = dimensions.pageHeight - dimensions.targetHeight;

          return scaleAndTranslate(
            offsetX,
            offsetY,
            offsetX,
            translateY ? offsetY + translateY : 0,
            scalingFactor
          );
        },
      };
    case 'zoom-in':
      let {scaleStart, scaleEnd} = options;

      if (scaleStart) {
        userAssert(
          scaleEnd > scaleStart,
          '"scale-end" value must be greater ' +
            'than "scale-start" value when using "zoom-in" animation.'
        );
      }

      return {
        duration: 1000,
        easing: 'linear',
        keyframes: [
          {transform: `scale(${scaleStart || SCALE_LOW_DEFAULT})`},
          {transform: `scale(${scaleEnd || SCALE_HIGH_DEFAULT})`},
        ],
      };
    case 'zoom-out':
      scaleStart = options.scaleStart;
      scaleEnd = options.scaleEnd;

      if (scaleStart) {
        userAssert(
          scaleStart > scaleEnd,
          '"scale-start" value must be ' +
            'higher than "scale-end" value when using "zoom-out" animation.'
        );
      }

      return {
        duration: 1000,
        easing: 'linear',
        keyframes: [
          {transform: `scale(${scaleStart || SCALE_HIGH_DEFAULT})`},
          {transform: `scale(${scaleEnd || SCALE_LOW_DEFAULT})`},
        ],
      };
  }
  return null;
};
