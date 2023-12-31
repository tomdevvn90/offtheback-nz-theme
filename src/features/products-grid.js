/**
 * Products Grid
 * 
 * @since 1.0.0
 * @author Mike
 */

((w, $) => {
  'use strict';
  
  const loadMoreProductsScrolling = ($elem) => {
    let { currentPaged, totalPages, limitNumberLoadmore } = $elem.data();
    let isLoading = false; 
    let $loadMoreMessage = $('<span class="loadmore-text" style="display: none;">Load more...</span>')
    
    if(limitNumberLoadmore > 0 && limitNumberLoadmore < totalPages) {
      totalPages = limitNumberLoadmore
    }

    $elem.after($loadMoreMessage);

    const isLoadmore = () => {
      let __end = $elem.offset().top + $elem.innerHeight();
      return $(w).scrollTop() + $(w).height() > __end ? true : false;
    }

    const getProducts = async (paged) => {
      const __html = await $.get(`/?page=${ paged }`);
      return $($(__html).find('.products-grid__js-selector:nth-child(1)').html());
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
      if(isLoadmore() && isLoading == false && currentPaged <= totalPages) {
        isLoading = true;
        $loadMoreMessage.css('display', 'block');

        currentPaged += 1;
        const $products = await getProducts(currentPaged);
        $elem.append($products);
        fixProductActions(document.querySelectorAll('.products-grid__js-selector [data-product-item]:not(.__fixProductActions)'));
        fixImageLazyLoad($products)

        setTimeout(() => {
          isLoading = false;
          $loadMoreMessage.css('display', 'none');
        }, 300)
      }

      if(currentPaged > totalPages) {
        $elem.closest('.custom-block__products-grid').addClass('__loadmore-completed')
      }
    })
  }

  const fixProductActions = (product_items) => {
    [...product_items].forEach((productItem) => {
      productItem.classList.add('__fixProductActions')
      new w.__ProductGridItem({
        el: productItem,
      })

      // productItem.classList.remove('__product-load-by-ajax-item')
    });
  }

  $(() => {
    $('.products-grid__js-selector').each(function() {
      let product_items = document.querySelectorAll('.products-grid__js-selector [data-product-item]');
      fixProductActions(product_items);
      loadMoreProductsScrolling($(this));
    })
  })

})(window, jQuery)