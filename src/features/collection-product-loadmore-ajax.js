/**
 * Loadmore ajax products collection page
 * 
 * @since 1.0.0
 * @author Mike
 */

((w, $) => {
  'use strict';

  const CollectionScrollingLoadmore = ($elem) => {
    let isLoading = false;
    let $paginatioNext = $elem.find('li.pagination--next a.pagination--item');
    let nextUrl = $paginatioNext.length ? $paginatioNext.attr('href') : '';
    let $loadMoreMessage = $('<span class="loadmore-text" style="display: none;">Load more...</span>');

    $elem.after($loadMoreMessage);

    const getProducts = async () => {
      const __html = await $.get(nextUrl);
      const $nextItem = $(__html).find('.pagination--container .pagination--next .pagination--item');
      const $products = $($(__html).find('ul.productgrid--items').html());

      if($nextItem.length) {
        const __nextUrl = $nextItem.attr('href');
        nextUrl = __nextUrl ? __nextUrl : '';
      } else {
        nextUrl = '';
      }

      return $products.addClass('__product-load-by-ajax-item');
    }

    const isLoadmore = () => {
      let __end = $elem.offset().top + $elem.innerHeight();
      return $(w).scrollTop() + $(w).height() > __end ? true : false;
    }

    const fixProductHoverAction = () => {
      let product_items = document.querySelectorAll('.__product-load-by-ajax-item');
      [...product_items].forEach((productItem) => {
        new w.__ProductGridItem({
          el: productItem,
        })

        productItem.classList.remove('__product-load-by-ajax-item')
      });
    }

    const fixImageLazyLoad = ($products) => {
      $products.find('[data-rimg-canvas]').remove();
      
      $products.find('[data-rimg]').each(function () {
        const $img = $(this);
        const { rimgMax, rimgTemplate } = $img.data();

        $img.removeAttr('srcset');
        $img.attr('src', rimgTemplate.replace('{size}', rimgMax));
      })
    }

    $(w).on('scroll', async (e) => {

      if(isLoadmore() && isLoading == false && nextUrl) {

        isLoading = true;
        $loadMoreMessage.css('display', 'block');
        let scrollTopAfterLoad = $(w).scrollTop();

        const $products = await getProducts();
        $elem.find('ul.productgrid--items').append($products);

        $(w).scrollTop(scrollTopAfterLoad + 300);

        setTimeout(() => {
          fixProductHoverAction();
          fixImageLazyLoad($products);

          isLoading = false; 
          $loadMoreMessage.css('display', 'none'); 
        }, 300)
      }
    })
  }

  /**
   * DOM Ready
   */
  $(() => {
    $('*[data-loadmore-ajax]').each(function() {
      const { loadmoreAjax } = $(this).data();
      if(loadmoreAjax != true) return;

      $(this).find('.pagination--container').css('display', 'none');
      CollectionScrollingLoadmore($(this)); 
    })
  })
})(window, jQuery)