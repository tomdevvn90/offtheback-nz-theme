/**
 * Fix UI
 */

;((w, $) => {
  'use strict';

  const productBadgePosition = () => {
    let $badge = $('body.template-product .product-details .product-pricing .product__badge--label');
    let $newPosWrapper = $('.product--outer .product-gallery');

    if($badge.length && $newPosWrapper.length) {
      $newPosWrapper.prepend($badge);
    }
  }

  $(() => {
    productBadgePosition();
  })

})(window, jQuery);