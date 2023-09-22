const hashTable = {
  'external report': 'extreport',
  'other external content': 'extcontent',
  'internal report': 'report',
  'metric': 'chart'
}

// function setState(state) {
//   if (typeof localStorage?.setItem === 'function') {
//     localStorage.setItem('sidebarState', JSON.stringify(state));

//     return true;
//   }

//   return false;
// }

// function getState() {
//   if (typeof localStorage?.getItem === 'function') {
//     const state = localStorage.getItem('sidebarState');

//     if (state) {
//       try {
//         return JSON.parse(state);
//       } catch {
//         return null;
//       }
//     }
//   }

//   return null;
// }

function setState(state, pageUrl) {
  if (typeof localStorage?.setItem === 'function') {
    localStorage.setItem(`sidebarState_${pageUrl}`, JSON.stringify(state));
    return true;
  }
  return false;
}

function getState(pageUrl) {
  if (typeof localStorage?.getItem === 'function') {
    const state = localStorage.getItem(`sidebarState_${pageUrl}`);
    if (state) {
      try {
        return JSON.parse(state);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Get the current page's URL
const currentPageUrl = window.location.href;

const state = new Proxy(getState(currentPageUrl) || {}, {
  set: function (obj, prop, value) {
    obj[prop] = value;

    return setState(obj, currentPageUrl);
  },
});

function noItemMessage() {
  if ($('.dashboards__dashboard').children('.dashboard-item').length != 0 || $('.folder-elements-wrapper').children('.dashboard-item').length != 0) {
    $('.no-tile-message').hide();
    $('.dashboards__upper').show();
    $('.dashboards__dashboard').show();
    $('.dashboards').css({ background: '#FFFFFF' });
  } else {
    $('.no-tile-message').show();
    $('.dashboards__upper').hide();
    $('.dashboards__dashboard').hide();
    $('.dashboards').css({ background: 'none' });
  }
}

function findParentNames(obj) {
  const names = [];

  //Object with prepared folder name and id
  const newObj = {
    name: obj.name,
    folder_id: obj.folder_id
  }

  if (obj) {
    names.push(newObj);

    if (obj.parent) {
      // names.push(obj.parent.name);
      names.push(...findParentNames(obj.parent));
    }
  }
  return names;
}

function announcementFunc(announcementTextWidth) {
  const $announcement = $('.announcement');
  // const $announcementBlock = $('.announcement__text p span, .announcement__text p');
  const $announcementBlock = $('.announcement__text');
  const $fadeWrapper = $('.announcement__text-fade-wrapper')

  $announcementBlock.css({
    display: 'block',
    'max-width': `${announcementTextWidth}px`,
    // 'text-overflow': 'ellipsis',
    overflow: 'hidden',
    // 'white-space': 'nowrap',
    // visibility: 'hidden',
    // opacity: '0',
  });

  $('.open-announce').on('click', function () {
    $announcement.addClass('js-toggle-announcement-text');

    // $('.announcement__text p span, .announcement__text p').css({
    //   'max-width': '100%',
    // });

    $fadeWrapper.hide();

    $announcementBlock
      .css({
        'text-overflow': 'unset',
        // overflow: 'hidden',
        // 'white-space': 'unset',
      })
      .animate(
        {
          'max-height': '800px',
        },
        100,
      );
  });

  $('.close-announce').on('click', function () {
    $announcement.removeClass('js-toggle-announcement-text');

    $fadeWrapper.show();

    if ($('.pp-page').hasClass('js-sidebar-opened')) {
      $announcementBlock
        .css({
          'max-width': `${announcementTextWidth - 216}px`,
          // 'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // 'white-space': 'nowrap',
        })
        .animate(
          {
            'max-height': '36px',
          },
          100,
        );
    } else {
      $announcementBlock
        .css({
          'max-width': `${announcementTextWidth}px`,
          // 'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // 'white-space': 'nowrap',
        })
        .animate(
          {
            'max-height': '36px',
          },
          100,
        );
    }
  });

}

function getDayOfWeek(dateString) {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date(dateString);
  const dayOfWeek = daysOfWeek[date.getDay()];
  return dayOfWeek;
}

function formatDate(dateString) {
  const dateParts = dateString.split('-');
  const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
  return formattedDate;
}

function dashboardDinamics() {
  const $tab = $('.dashboards__tab');
  // const $docs = $('.dashboards__docs');
  const tileView = $('.tile');
  const listView = $('.list');

  if ($tab?.length) {
    $tab[0].click();

    $tab.on('click', function () {
      const $this = $(this);
      const $tabTopic = $this.data('tag-tab-name');

      $this.siblings().removeClass('js-tab-active');
      $this.addClass('js-tab-active');

      $(`.dashboards__dashboard`).removeClass('js-viewing').hide();
      $(`.dashboards__dashboard[data-topic="${$tabTopic}"]`)
        .addClass('js-viewing')
        .show();
    });
  }

  tileView.on('click', function () {
    listView.removeClass('js-active');
    $(this).addClass('js-active');

    $('.dashboards__dashboard').removeClass('js-list-view');
    $('.dashboards__dashboard').addClass('js-tile-view');
  });

  listView.on('click', function () {
    tileView.removeClass('js-active');
    $(this).addClass('js-active');

    $('.dashboards__dashboard').removeClass('js-tile-view');
    $('.dashboards__dashboard').addClass('js-list-view');
  });

  tileView.click();
}

function infoPopup($infoBlock) {
  let timer;
  //Add info popup on hover
  $(document).on('mouseenter', '.info-btn', function (e) {
    if (timer) {
      clearTimeout(self.timer);
    }

    //Adding custom fields to info popup
    dash.customFieldsDisplayOnTileInfo = {
      "used_for_metric_ind": "Y",
      "used_for_report_ind": "Y",
      "used_for_external_report_ind": "Y",
      "used_for_external_report_ind": "Y"
    };

    $infoBlock.html(
      MI.PortalPageView.buildElementInfoPopup($(this).data('info-id')),
    );

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const scrollX = $(window).scrollLeft();
    const scrollY = $(window).scrollTop();
    let maxRight = $(window).width() - $infoBlock.outerWidth() + scrollX;
    let maxTop = $(window).height() - $infoBlock.outerHeight() + scrollY - 40;
    const left = Math.min(mouseX + scrollX, maxRight);
    const top = Math.min(mouseY + scrollY, maxTop);
    const position = $(this).offset();



    $infoBlock.css({
      top: top - 20 + 'px',
      left: left + 'px',
    });
  });

  $(document).on('mouseenter', '.info-block', function () {
    if (timer) {
      clearTimeout(timer);
    }
  });

  //Remove info popup on mouse out
  $(document).on('mouseleave', '.info-btn', function () {
    timer = setTimeout(function () {
      $infoBlock.html('');
    }, 50);
  });

  $(document).on('mouseleave', '.info-block, .el-info-cart', function () {
    timer = setTimeout(function () {
      $infoBlock.html('');
    }, 50);
  });
}

function formatTitleText(text, row, lastRow) {
  let formattedText = '';
  const lines = text.split('\n');
  for (let line of lines) {
    if (line.length > row) {
      const words = line.split(' ');
      let newLine = '';
      for (let word of words) {
        if (word.length > row) {
          const slicedWord = word.slice(0, row) + '<br>' + word.slice(row);
          newLine += slicedWord + ' ';
        } else {
          newLine += word + ' ';
        }
      }
      line = newLine.trim();
    }
    if (line.length > lastRow) {
      line = line.slice(0, lastRow - 3) + '...';
    }
    formattedText += line + '<br>';
  }
  return formattedText.slice(0, -4);
}

//Functoin to change hex type color to rgb
function hexToRgb(hex) {
  // Remove the # character, if present
  hex = hex.replace('#', '');

  // Convert the hex value to RGB
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an object
  return { r: r, g: g, b: b };
}

class simplifyCatalog {
  constructor(props) {
    this.multifolderSelect = props.multifolderSelect || 'N';

    this.folders = props.folders;

    this.enableHideTopbar = props.enableHideTopbar;
    this.topMenuColor = props.topMenuColor;
    this.highlightColor = props.highlightColor;
    this.topMenuBackground = props.topMenuBackground;
    this.topbarCustomListColor = props.topbarCustomListColor;

    this.backgroundColor = props.backgroundColor;
    this.elementPreviewType = props.elementPreviewType;
    this.announcementWrapper = $('.announcement');
    this.tagsVariable = props.tagsVariable;

    this.hideAnnouncements = props.hideAnnouncements;
    this.announcements = props.announcements;
    this.dismissAnnouncement = props.dismissAnnouncement;
    this.announcementBehavior = props.announcementBehavior;

    this.globalSidebarFolders = props.globalSidebarFolders;
    this.chosenElementsId = props.chosenElementsId;
    this.externalContentDataset = props.externalContentDataset;
    this.mainPageColor = props.mainPageColor;


    this.width = $(window).width();
    this.height = $(window).height() - 87;

    this.annauncementWidth = $('.announcement__description-block').width() - 130;

    this.pageInternalName = document.location.href.split('?')[0].split('/')[4];

    // this.announcementTextWidth = $('.announcement__description-block').width() - 336;

    this.globalFullObject = [];
    this.folderItems = [];
    this.plugins = [];
    this.connectionProfileIdsMap = new Map();

    this.sidebarBottomLinks = props.sidebarBottomLinks;

    this.favoritesFolder = '';

    // Global colors variable
    this.colors = colorsFT;

    /**
   * @type {NavigationBar}
   */
    this.navigationBar = props.navigationBar;

    this.folderChilds = {};
  }

  init() {
    const $tagTabsWrapper = $('.dashboards__tabs');
    const $dashboards = $('.dashboards');
    const $announcementTitle = $('.announcement__lower-title');
    const self = this;

    this.customUi();


    //Announcement
    if (this.announcements && this.hideAnnouncements !== '' && this.hideAnnouncements !== 'Y') {

      this.fetchAnnouncement()
        .then((response) => {

          for (const announcementData of response.announcements) {

            if (announcementData && announcementData.id == this.announcements) {
              const announcement = announcementData;


              $announcementTitle.append(announcement.subject);
              $('.announcement__text').prepend(announcement.html_code);

              this.announcementWrapper.show();
              announcementFunc(this.annauncementWidth);

              switch (this.announcementBehavior) {
                case 'turned':
                  $('.announcement').addClass('turned-type');
                  break;
                case 'opened':
                  $('.announcement').addClass('opened-type');
                  break;
                default:
                  $('.announcement').addClass('turned-type');
              }

              if ($('.announcement').hasClass('opened-type')) {
                let heightAnn = $('.announcement').innerHeight();

                $('.dashboards__dashboard').css({
                  'height': `calc(100vh - ${heightAnn + 183}px)`
                })
              }

              setTimeout(() => {
                if ($('.pp-page').hasClass('js-sidebar-opened')) {
                  $('.announcement__text').css({
                    'max-width': `${this.annauncementWidth - 216}px`,
                    visibility: 'visible',
                    opacity: '1',
                  });

                  $(`.js-toggle-announcement-text .announcement__text, 
                      .js-toggle-announcement-text .announcement__text`).css({
                    'max-width': '100% !important',
                  });
                } else {
                  $('.announcement__text').css({
                    'max-width': `${this.annauncementWidth}px`,
                    visibility: 'visible',
                    opacity: '1',
                  });
                }
              }, 500);

              break;
            } else {
              this.hideAnnouncement();
            }
          }

        })
        .catch(() => {
          this.hideAnnouncement();
        });
    } else {
      this.hideAnnouncement();
    }

    if (this.hideAnnouncements === 'Y') {
      this.hideAnnouncement();
    }

    if (this.dismissAnnouncement && this.dismissAnnouncement === 'Y') {
      this.announcementWrapper.addClass('enable-dismiss');
    } else {
      this.announcementWrapper.addClass('disable-dismiss');
    }

    $('.dismiss-announce').on('click', function () {
      self.announcementWrapper.hide();
      const announcementId = $('.announcement').data('announcement-id');

      $('.dashboards__dashboard').addClass('closed-announcement');
      self.dismissAnnouncementUpdate(announcementId);
    })

    $(document).on('click', '.js-menu-close-btn', function () {

      if ($('.announcement').hasClass('js-toggle-announcement-text')) {
        $('.announcement__text').css({
          'max-width': `100% !important`,
        });
      } else {
        $('.announcement__text').css({
          'max-width': `${self.annauncementWidth}px`,
        });
      }

    });

    $(document).on('click', '.pp-left-bar-btn', function () {

      if ($('.announcement').hasClass('js-toggle-announcement-text')) {
        $('.announcement__text').css({
          'max-width': `100% !important`,
        });
      } else {
        $('.announcement__text').css({
          'max-width': `${self.annauncementWidth - 216}px`,
        });
      }

    });

    // sidebarFunc();

    //Build Tag tabs and dasboards
    if (this.tagsVariable?.length && this.multifolderSelect === 'N') {
      for (let tag of this.tagsVariable) {
        const tagItem = tag['Tag'];
        const tagName = tag['Tag name'];
        const tagTooltip = tag['Tooltip'];

        $tagTabsWrapper.append(`
              <div class="dashboards__tab" data-tag-tab-name="${tagItem}" data-tooltip-text="${tagTooltip}">
                ${tagName}
              </div>
        `);

        $dashboards.append(`
          <div data-topic="${tagItem}" class="dashboards__dashboard">
            <div class="dashboard-upper-list">
              <span class="dashboard-upper-list__name">Report name</span>
              <span class="dashboard-upper-list__tags">Tags</span>
              <span class="dashboard-upper-list__last-viewed">Last Viewed</span>
              <span class="dashboard-upper-list__engagement">Engagement</span>
            </div>
            <div class="no-items-message" style="display: none;"></div>
          </div>
        `);

        dashboardDinamics();
      }
    } else if (!this.tagsVariable?.length || this.tagsVariable?.length && this.multifolderSelect === 'Y') {
      $dashboards.append(`
          <div class="dashboards__dashboard js-dashboard-loaded">
            <div class="dashboard-upper-list">
              <span class="dashboard-upper-list__name">Report name</span>
              <span class="dashboard-upper-list__tags">Tags</span>
              <span class="dashboard-upper-list__last-viewed">Last Viewed</span>
              <span class="dashboard-upper-list__engagement">Engagement</span>
            </div>
            <div class="no-items-message" style="display: none;"></div>
          </div>
        `);

      dashboardDinamics();
    }

    new Promise((resolve) => {
      $.ajax({
        url: '/home/index/refresh/ajax/Y?with_topics=Y',
        data: {
          folder_item: 'Y',
          all_folder: 'Y'
        },
        dataType: 'json',
      }).done(function (response) {
        dash.InitForPortalPage(response);

        resolve();
      });
    }).then(async () => {
      const rows = dash.db.Get();

      for (const folderItem of dash.folderItems) {
        this.folderItems.push(folderItem);
      }

      const $dashboard = $('.dashboards__dashboard');
      const $infoBlock = $('.info-block');

      for (const element of rows) {
        this.globalFullObject.push({
          element_id: element.element_id,
          element_dashboard_name: element.element_dashboard_name,
          user_dashboard_element_instance_id:
            element.user_dashboard_element_instance_id,
          element_type: element.element_type,
          segment_value_id: element.segment_value_id,
          content_type: element.content_type,
          element_type: element.element_type,
          topics: element.topics,
          user_id: element.user_id,
          in_favorites: element.in_favorites,
          is_in_favorites: element.is_in_favorites,
          folder_id: element.folder_id,
          user_id: element.user_id,
          section_type: element.section_type,
          has_access: element.has_access,
          total_view_count: element.global_total_view_count,
        });
      }

      

      this.fetchPluginName().then(res => {
        for(const plugin of res.data_source_plugins) {
          this.plugins.push(plugin);
        }
      })

      await this.fetchElementInfo().then(res => {
        const elementsInfo = res.info;

        console.log(elementsInfo)

        for (const element of this.globalFullObject) {
          const matchedElement = elementsInfo.find(info => info.id === element.element_id && info.dimension_value === element.segment_value_id);

          if (matchedElement) {
            element.plugin_connection_profile_id = matchedElement.plugin_connection_profile_id;
            element.plugin_internal_name = matchedElement.plugin_internal_name;
          }
        }
      });

      await this.recentlyViewedItems().then((resp) => {
        for (const item of this.globalFullObject) {

          for (let view of resp.views) {

            if (item.element_id === view.element_id) {
              item.last_view_time = view.last_view_time;
            }

          }

        }
      });

      for (const element of this.globalFullObject) {
        const matchingObjs = self.folderItems.filter(el => el.element_id === element.element_id && el.segment_value_id === element.segment_value_id);
        
        for (const folderId of element.folder_id) {
          const matchingObjByFolder = matchingObjs.find(obj => obj.folder_id === folderId);
          
          if (matchingObjByFolder) {
            element.display_order = element.display_order || {};
            element.display_order[folderId] = matchingObjByFolder.display_order;
          }
        }
      }

      const topicIds = Array.from(
        new Set(
          this.globalFullObject
            .map((item) => item.topics)
            .reduce((prev, curr) => {
              prev.push(...curr);

              return prev;
            }, []),
        ),
      );

      const parsedTopicsData = {};

      this.fetchTopics().then(res => {

        for (const topic of res.topics) {
          if (topicIds.includes(topic.id)) {
            parsedTopicsData[topic.id] = topic;
          }
        }
      })

      await this.checkPbiToken();

      this.globalFullObject = this.globalFullObject.sort(function (a, b) {
        return a.display_order - b.display_order;
      });

      const buildDashboard = function (elements, folderName, currentfolderId) {
        $dashboard.find('.dashboard-item').remove();

        const sortedElements = self.globalFullObject.filter(
          (el) => el.section_type == 'Category',
        )

        for (const element of sortedElements) {
          if(element.display_order) {
            element.order = element.display_order[currentfolderId]
          }
        }

        sortedElements.sort((a, b) => {
          return a.order - b.order;
        })

        for (const element of sortedElements) {
          const topics = element.topics;

          /* Get Topics */
          if (topics?.length && self.tagsVariable?.length) {
            for (const topic of topics) {

              if (parsedTopicsData[topic]) {
                const topicData = parsedTopicsData[topic];

                //Add id attribute to dashboards
                $dashboard.each(function (i) {
                  const $this = $(this);

                  if ($this.data('topic') == topicData.name) {
                    for (const item of elements) {
                      if (element.element_id == item) {
                        self.buildDashboardItem($this, element, folderName, element.order);
                      }
                    }
                  }

                  noItemMessage();
                });
              }
            }
          }

          if (self.tagsVariable.length == 0) {

            //If multifolder selected to N build basic structure
            if (self.multifolderSelect === 'N') {
              $dashboard.each(function (i) {
                const $this = $(this);

                for (const item of elements) {
                  if (+element.element_id === item) {
                    self.buildDashboardItem($this, element, folderName);
                  }
                }

                noItemMessage();
              });
            }

          }
        }

        self.preloadThumbnails()

        $('.dashboard-item').each((i, item) => {
          if ($(item).data('access') == 'N') {
            $(item).find('.favorite-btn').hide();
          }
        });
      };

      //Function to build dashboard with multifodler as at the catalog
      const buildDashboardWithMultifolder = function (wrapper, elements, folderName) {
        const filteredElements = elements.filter(
          (el) => el.section_type == 'Category',
        )
        // .sort(function(a, b) {
        //   return a.display_order - b.display_order;
        // });



        if (filteredElements.length) {
          for (const element of filteredElements) {
            self.buildDashboardItem(
              wrapper,
              element,
              folderName,
            );
          }

          self.preloadThumbnails()
        }

        // noItemMessage();

        $('.dashboard-item').each((i, item) => {
          if ($(item).data('access') == 'N') {
            $(item).find('.favorite-btn').hide();
          }
        });
      }

      $(document).on('click', '.js-menu-title', function () {
        const $this = $(this);
        const currentfolderId = $this.data('nav-folder-id');

        console.log(currentfolderId)

        $('.dashboards__title').html($this.data('folder-name'));

        if (self.multifolderSelect == 'N' || self.multifolderSelect == '') {
          const elements = $this.data('elements');
          const folderName = $this.data('folder-name');

          buildDashboard(elements, folderName, currentfolderId);

          $('.dashboard-item__tags').each((i, item) => {
            for (const tag of $(item).data('tags')) {
              if (parsedTopicsData[tag]) {
                $(item).append(`
                  <span class="dashboard-item__tags-tag">${parsedTopicsData[tag].name}</span>
                `);
              }
            }
          });
        }

        if (self.multifolderSelect === 'Y') {

          self.navigationBar.inited.then(() => {

            if (!Object.keys(self.folderChilds).length) {
              const folders = self.navigationBar.loadedFoldersData.sort(
                (a, b) => {
                  return a.parent_folder_id - b.parent_folder_id;
                },
              );

              for (const folder of folders) {
                if (!self.folderChilds[folder.folder_id]) {
                  self.folderChilds[folder.folder_id] = folder;
                }
              }

              for (const folder of folders) {

                if (folder.parent_folder_id && self.folderChilds[folder.parent_folder_id]) {
                  if (!self.folderChilds[folder.parent_folder_id].childs) {
                    self.folderChilds[folder.parent_folder_id].childs = {};
                  }

                  self.folderChilds[folder.parent_folder_id].childs[
                    folder.folder_id
                  ] = self.folderChilds[folder.folder_id];

                  self.folderChilds[folder.folder_id].parent =
                    self.folderChilds[folder.parent_folder_id];
                }
              }
            }

            const $list = $this.next();

            const folderId = $list.data('nav-folder');

            const subfolderElements = self.getSubfolderElementsDeep(
              self.folderChilds[folderId],
            );

            for (const [folderId, sEl] of Object.entries(subfolderElements).sort((a, b) => {
              const folderA = self.folderChilds[a[0]];
              const folderB = self.folderChilds[b[0]];

              return folderA.display_order - folderB.display_order;
            })) {
              const folder = self.folderChilds[folderId];

              let folderBreadcrumbsArray = findParentNames(folder).reverse();

              //Wrapper block for breadcrumbs and elements below. Need to hide/show whole block while searching elements inside dashboard
              const $folderElementsWrapper = $('<div>');
              $folderElementsWrapper.addClass('folder-elements-wrapper');

              //wrapper for breadcrumbs
              let $breadcrumbsWrapper = $('<div>');
              $breadcrumbsWrapper.addClass('elements-breadcrumbs');

              $folderElementsWrapper.append($breadcrumbsWrapper);

              for (const fbItem of folderBreadcrumbsArray) {
                let input = `<span class="elements-breadcrumbs__item" data-folder-id="${fbItem.folder_id}" data-folder="${fbItem.name}">${fbItem.name}</span>`;

                $breadcrumbsWrapper.append(input);
                $('.dashboards__dashboard').append($folderElementsWrapper);
              }


              const currentFolder = folderBreadcrumbsArray[folderBreadcrumbsArray.length - 1].folder_id;

              for (const element of sEl) {
                
                if(element.display_order[currentFolder]) {
                  element.order = element.display_order[currentFolder]
                }
                
              }

              sEl.sort(function (a, b) {
                return a.order - b.order;
              });

              buildDashboardWithMultifolder($folderElementsWrapper, sEl, folder.name);
            }

            $('.dashboard-item__tags').each((i, item) => {
              for (const tag of $(item).data('tags')) {
                if (parsedTopicsData[tag]) {
                  $(item).append(`
                    <span class="dashboard-item__tags-tag">${parsedTopicsData[tag].name}</span>
                  `);
                }
              }
            });

            noItemMessage();
          });

          $dashboard.find('.folder-elements-wrapper').remove();
          $dashboard.find('.dashboard-item').remove();
          $dashboard.find('.elements-breadcrumbs').remove();
        }

        state.clickedFolder = $this.data('folder-name');
      });

      const sortedElemsArray = this.globalFullObject.sort(function (a, b) {
        const dateA = new Date(a.last_view_time);
        const dateB = new Date(b.last_view_time);
        return dateB - dateA;
      });

      let uniqueFavoriteObjects = $.grep(sortedElemsArray.filter(
        (el) => el.section_type == 'Favorite',
      ), function (obj, index) {
        return $.inArray(obj.element_dashboard_name, $.map(sortedElemsArray.filter(
          (el) => el.section_type == 'Favorite',
        ), function (obj) {
          return obj.element_dashboard_name;
        })) === index;
      });

      //Build Favorites
      for (const sortedItem of uniqueFavoriteObjects) {
        if (
          sortedItem.is_in_favorites == '1' &&
          sortedItem.section_type == 'Favorite'
        ) {
          this.buildSideItem('append', $('.favorites__main'), sortedItem);
        }
      }

      //Build recently viewed column
      const sortedEntitiesArray = [];
      //Get existing entities
      this.getEntities('Recently Viewed', this.pageInternalName).then(
        (entities) => {
          entities.map((entity) => {
            sortedEntitiesArray.push(entity.value);
          });
        },
      );

      //Sort entity array by date
      sortedEntitiesArray.sort(function (a, b) {
        const dateA = new Date(a.last_view_time);
        const dateB = new Date(b.last_view_time);
        return dateB - dateA;
      });

      //slice array if entities to 20 items
      const slicedEntitiesArray = sortedEntitiesArray.slice(0, 20);

      //Append elements from sorted and sliced array
      for (const cuttedItem of slicedEntitiesArray) {
        if (cuttedItem.last_view_time) {
          this.buildSideItem('append', $('.recently-viewed__main'), cuttedItem);
        }
      }

      const recentlyViewedObj = [];


      this.checkUrlElementParams();

      $(document).on(
        'click',
        '.dashboard-item__main, .link-btn, .side-item',
        function () {
          const $this = $(this);

          self.getEntities('Recently Viewed').then((entities) => {
            for (const element of self.globalFullObject) {
              if (element.element_id == $this.data('element-id') && element.segment_value_id == $this.data('segment')) {
                element.last_view_time = self.trackDateOnClick();

                //Check if array is not empty
                if (entities?.length) {
                  //Flag to check if entity is alrady exist
                  let entityExist = false;

                  for (const entetyItem of entities) {
                    //If entity id is same as element id update entity item
                    if (entetyItem.id == $this.data('element-id')) {
                      //Refresh item with new date to recently viewed column
                      $(
                        `.recently-viewed__main .side-item[data-element-id="${$this.data(
                          'element-id',
                        )}"][data-segment="${$this.data(
                          'segment',
                        )}"]`,
                      ).remove();
                      self.buildSideItem(
                        'prepend',
                        $('.recently-viewed__main'),
                        element,
                      );

                      self.updateEntity(
                        'Recently Viewed',
                        element,
                        entetyItem.id,
                      );
                      entityExist = true;
                      break;
                    }
                  }
                  //If entity array is empty add new one
                  if (!entityExist) {
                    //Add item with new date to recently viewed column
                    self.buildSideItem(
                      'prepend',
                      $('.recently-viewed__main'),
                      element,
                    );

                    self.addEntities(
                      'Recently Viewed',
                      element,
                      element.element_id,
                    );
                    break;
                  }
                } else {
                  //Add item with new date to recently viewed column
                  self.buildSideItem(
                    'prepend',
                    $('.recently-viewed__main'),
                    element,
                  );

                  self.addEntities(
                    'Recently Viewed',
                    element,
                    element.element_id,
                  );
                  break;
                }
              }
            }
          });
        },
      );

      //Open iframe window for report
      $(document).on('click', '.dashboard-item__main', function () {
        const $this = $(this);

        // MI.PortalPageView.openPreview($(this).data('info-id'));

        if ($this.data('page')) {
          window.open($this.data('page'), '_blank');
        }
      });

      $(document).on('click', '.side-item', function () {
        const $this = $(this);

        // MI.PortalPageView.openPreview($(this).data('info-id'));

        if ($this.data('page')) {
          window.open($this.data('page'), '_blank');
        }
      });

      const myPromise = new Promise((resolve, reject) => {
        // Some asynchronous operation, such as fetching data from an API
        const data = this.getFavorite();
        // Once the data is available, call the resolve function with the data
        resolve(data);
      });

      myPromise.then((data) => {
        const favorites = data.favorites;

        for (let i = 0; i < favorites.length; i++) {
          if (favorites[i].name === 'My Favorites') {
            this.favoritesFolder = favorites[i].id;

            this.favoriteToggle('.favorite-btn', this.favoritesFolder);
          }
          // else if (favorites[i].name == 'Most Popular') {
          //   this.favoritesFolder = favorites[i].id;

          //   this.favoriteToggle('.favorite-btn', this.favoritesFolder);
          // }
        }
      });

      // const self = this;

      //Open iframe window for report
      $(document).on('click', '.dashboard-item__main, .side-item', function () {
        const $this = $(this);

        const plugin = $this.data('plugin');
        const pluginId = $this.data('plugin-id');
        const isPbiAuth = $this.data('is-token');

        const elementName = $this.data('element-name');
        const foldertName = $this.data('folder-name');
        const elementId = $this.data('element-id');
        const elementSegment = $this.data('segment');
        const elementSrc = $this.data('iframe');
        const elementType = $this.data('element-type');

        // const loadIframe = () => {
        //   $('.pp-iframe__wrapper').html(`
        //     <iframe style="width:${self.width - 30}px; height:${self.height - 30
        //       }px; border: none;" name="frame" id="frame" frameborder="0" src="${elementSrc}"></iframe>
        //   `);
        // }

        if (self.elementPreviewType == 'iframe') {
    
          if ($this.data('iframe')) {

      //       let folderName = '';

      //       $('.pp-page').addClass('js-iframe-page');

      //       if ($this.data('folder-name')) {
      //         folderName = `<span class="pp-iframe__breadcrumbs-item">${$this.data(
      //           'folder-name',
      //         )}</span>`;
      //       } else {
      //         folderName = '';
      //       }

      //       $('.pp-iframe__breadcrumbs-chain').html(`
      //   ${folderName}
      //   <span class="pp-iframe__breadcrumbs-item">${$this.data(
      //         'element-name',
      //       )}</span>
      // `);

      //       if ($('.pp-left-bar').hasClass('open')) {
      //         $('.js-menu-close-btn').trigger('click');
      //         $('.pp-left-bar-btn').hide();
      //       }

      //       $('.pp-left-bar-btn').hide();

      //       $('.pp-container').hide();
      //       $(document).find('.pp-iframe').css({ display: 'flex' });

            self.buildElementView(foldertName, elementName);

            if(plugin === 'powerbi') {

              console.log('Check', elementId, pluginId, self.connectionProfileIdsMap)
              const connectionProfileToken = self.connectionProfileIdsMap.get(pluginId.toString());

              console.log(connectionProfileToken, isPbiAuth)

              if(connectionProfileToken === 'N' && isPbiAuth === 'N') {
                console.log(connectionProfileToken, isPbiAuth);

                const token = self.getPbiToken(elementName, foldertName, elementId, elementSegment, elementSrc, elementType, pluginId);

                self.connectionProfileIdsMap.set(pluginId, token);
              } else {
                self.loadIframe(elementSrc);
              }

            } else {
              self.loadIframe(elementSrc);
            }

            $('#frame').on('load', function () {
              $('#frame')
                .contents()
                .find('html')
                .addClass('without-scroll-fix');
            });
          }

          $('.ui-dialog-titlebar-close').click();
        } else {
          if ($(this).parent().data('access') == 'N' || $(this).data('access') == 'N') {
            $('.pp-access-denied__wrapper').show();
            $('.pp-access-denied').show()
          } else {
            MI.PortalPageView.openPreview($(this).attr('data-info-id'));
          }
        }
      });

      const user = await this.getUser();

      const { groups } = user;
      const userGroups = groups;

      if (typeof userGroups != 'undefined') {
        if (
          typeof state.clickedFolder === 'undefined' ||
          !state.clickedFolder
        ) {
          let menuElem = '';

          $('.pp-left-bar-menu__title').each((i, item) => {
            let defaultArr = $(item).data('default-group-id');

            if (defaultArr?.length) {
              for (const userGroup of userGroups) {
                defaultArr.find(id => {

                  if (id == userGroup.group_id) {
                    menuElem = $(`.pp-left-bar-menu__title[data-default-group-id="[${defaultArr}]"]`);
                  }
                });
              }
            }
          })
          $(menuElem.get(0)).trigger('click');

        } else {
          setTimeout(() => {
            $(
              `.js-menu-title[data-folder-name="${state.clickedFolder}"]`,
            ).trigger('click');
          }, 200)
        }
      }

    });

    //Change iframe window size on resize of viewport
    $(window).resize(function () {
      if ($('.pp-page').hasClass('js-iframe-page')) {
        let $iframe = $('#frame');

        self.width = $(window).width();
        self.height = $(window).height() - 87;

        //Replace iframe's src to reload iframe
        let newSrc = $iframe.attr('src')
          .replace(/width\/\d+/, `width/${self.width - 5}`)
          .replace(/height\/\d+/, `height/${self.height - 25}`)

        $iframe.css({
          'width': self.width,
          'height': self.height
        })
        $iframe.attr('src', newSrc);
      }

    });

    //Close popup when click above it
    $(document).mouseup(function (e) {
      var popup = $('.pp-access-denied, .pp-access-requested');
      if (!popup.is(e.target) && popup.has(e.target).length === 0) {
        $('.pp-access-denied__wrapper').hide();
        popup.hide();
      }
    });

    $(document).on('click', '.cancel-popup, .submit-popup', function () {
      $('.pp-access-denied, .pp-access-denied__wrapper').hide();
    });

    $(document).on('click', '.pp-iframe__breadcrumbs-btn', function () {
      $('.pp-page').removeClass('js-iframe-page');
      $('.pp-container').show();
      $('.pp-iframe').hide();
      $('.pp-left-bar-btn').show();

      $('.pp-left-bar-btn').click();

      $('.pp-iframe__wrapper').html('');
    });

    // $(document).on('click', '.link-btn', function () {
    //   location.href = $(this).data('external-url');
    // });

    // $(document).on('contextmenu', '.link-btn', function (event) {
    //   if (event.which === 3) {
    //     event.preventDefault();

    //     if ($(this).data('outer-link') !== '#') {
    //       window.open($(this).data('outer-link'), '_blank');
    //     }
    //   }
    // });

    //Add info popup on hover
    infoPopup($('.info-block'));

    this.buildSidebarBottomLinks();

    $('body').prepend(`
    <style>
      .link-btn:hover svg path {
        fill: ${this.colors.mainActive};
      }

      .favorite-btn:hover svg path {
        fill: ${this.colors.mainActive};
      }

      .info-btn:hover svg path {
        fill: ${this.colors.mainActive};
      }
    </style>`);

    $('.dashboards__tab').each((i, item) => {
      $(item)
        .after()
        .css({
          content: `${$(item).data('tooltip-text')}`,
        });
    });

    if ($('.dashboards__tab').length == 1) {
      $('.dashboards__tab').css({
        border: '1px solid rgba(204, 207, 212, 0.6)',
        'border-radius': '3px',
      });
    } else if ($('.dashboards__tab').length == 2) {
      $('body').prepend(`
        <style>
          .dashboards__tab:nth-child(2) {
            border-radius: 0 3px 3px 0;
            border-left: 1px solid transparent;
            border-right: 1px solid rgba(204, 207, 212, 0.6) !important;
            transform: translateX(-1px);
          }

          .dashboards__tab.js-tab-active:nth-child(2) {
            border-radius: 0 3px 3px 0;
            border-left: 1px solid transparent;
            border-right: 1px solid ${this.mainPageColor} !important;
            transform: translateX(-1px);
          }
        </style>
      `);
    }

    
  }

  buildElementView(folderName, elementName) {
    let fName = '';

    $('.pp-page').addClass('js-iframe-page');

    if (folderName) {
      fName = `<span class="pp-iframe__breadcrumbs-item">${folderName}</span>`;
    } else {
      fName = '';
    }

    $('.pp-iframe__breadcrumbs-chain').html(`
        ${fName}
        <span class="pp-iframe__breadcrumbs-item">${elementName}</span>
      `);

    if ($('.pp-left-bar').hasClass('open')) {
      $('.js-menu-close-btn').trigger('click');
      $('.pp-left-bar-btn').hide();
    }

    $('.pp-left-bar-btn').hide();

    $('.pp-container').hide();
    $(document).find('.pp-iframe').css({ display: 'flex' });

  }

  async buildConnectionProfilesSet() {
    const connectionProfilesSet = new Set();

    this.globalFullObject.forEach((item) => {
      if (item.plugin_connection_profile_id) {
        connectionProfilesSet.add(item.plugin_connection_profile_id);
      }
    });

    return connectionProfilesSet;
  }

  loadIframe(elementSrc) {
    $('.pp-iframe__wrapper').html(`
      <iframe style="width:${this.width - 30}px; height:${this.height - 30
        }px; border: none;" name="frame" id="frame" frameborder="0" src="${elementSrc}"></iframe>
    `);
  }

  hideAnnouncement() {
    this.announcementWrapper.hide();
    $('.dashboards').addClass('closed-announcement');
  }

  customUi() {
    if (this.topMenuBackground || this.topMenuBackground != '') {
      $('.top_menu').css({
        'background': this.topMenuBackground,
      });

      $('.top_menu ul li').css({
        'border': 'none',
      });
    }


    if (this.highlightColor || this.highlightColor != '') {
      $('.top_menu .highlightCurrentPage').css({
        'background': `${this.highlightColor} !important`
      })

      $('body').prepend(`
        <style>
          .top_menu ul.mod_full-height-menu > li.active, 
          .top_menu ul.mod_full-height-menu > li:hover,
          .top_menu ul.mod_full-height-menu .highlightCurrentPage {
            background: ${this.highlightColor} !important;
          }

          .top_menu .top-bar-dropdowns-menu li:hover {
            background: ${this.highlightColor} !important;
          }

          .top_menu .main-search {
            background: ${this.highlightColor} !important;
          }
        </style>
      `)
    }


    if (this.topMenuColor || this.topMenuColor != '') {
      $('.top_menu p, .top_menu span, .top_menu ul li, .top_menu b, .top_menu i').css({
        color: this.topMenuColor,
        fill: this.topMenuColor
      })

      $('.main-search__icon svg path').css({
        color: this.topMenuColor,
        fill: this.topMenuColor
      })

      $('body').prepend(`
        <style>
          .top_menu #globalSearchInput::placeholder {
            color: ${this.topMenuColor}
          }

          .main-search__close::after,
          .main-search__close::before {
            background: ${this.topMenuColor} !important;
          }

          .main-search__input[type="text"] {
            color: ${this.topMenuColor}
          }
        </style>
      `)
    }

    if (this.topbarCustomListColor || this.topbarCustomListColor != '') {
      $('body').prepend(`
        <style>
          .top-bar-dropdowns-menu .topMenuArrow ul, 
          .topMenuArrow.active, 
          .topMenuArrow.hovered, 
          .top_menu > ul > li.topMenuArrow.hovered > a,
          .top_menu > ul > li.topMenuArrow.active,
          .topMenuArrow .hovered {
            background: ${this.topbarCustomListColor} !important;
          }
        </style>
      `)
    }

    //Enable hide/show button
    if (this.enableHideTopbar && this.enableHideTopbar !== 'N' && this.enableHideTopbar !== '') {
      $('.top_menu_container').append(`
        <div class="top-wrap-btn" style="">&#x2191;</div>
      `);
    }


    $('.top-wrap-btn').on('click', function () {
      $('.top_menu_container, body').toggleClass('wrapped-up-topbar');
    });

    //If variable is not empty, change all title, links and 'mainActive' colored item to current color.
    if (this.mainPageColor && this.mainPageColor != '') {
      //Transform hex to R G B to fill colors with opacity (alpha at rgba);
      const rgbFormat = hexToRgb(this.mainPageColor);

      $('.pp-page').prepend(`
        <style>
          a,
          .announcements-link,
          .close-announce,
          .side-item__title-name,
          .dashboard-item__title,
          .announcement__read-more,
          .announcement__dismiss,
          .announcement__lower-title,
          .elements-breadcrumbs__item:not(:last-child) {
            color: ${this.mainPageColor};
          }

          .pp-left-bar-menu__title-arrow, 
          .pp-left-bar-menu__title-arrow path,
          .announcements-link__svg,
          .announcements-link__svg path,
          .pp-left-bar-btn-icon svg,
          .pp-left-bar-btn-icon svg path,
          .js-menu-title-icon__icon,
          .js-menu-title-icon__icon path {
            fill: ${this.mainPageColor};
          }

          .tile.js-active svg,
          .tile.js-active svg path,
          .list.js-active svg,
          .list.js-active svg path {
            fill: ${this.mainPageColor} !important;
          }

          .dashboards .tile.js-active,
          .dashboards .list.js-active {
            border: 1px solid ${this.mainPageColor};
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.1);
          }

          .label_element_list.tags_list li {
            border: none;
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.7);
          }

          .pp-access-denied__icon svg path {
            fill: ${this.mainPageColor};
          }

          .submit-popup {
            background: ${this.mainPageColor};
          }

          .submit-popup:hover {
            color: ${this.mainPageColor} !important;
            background: transparent !important;
            border: 1px solid ${this.mainPageColor} !important;
          }

          .pp-access-denied__main a {          
            color: ${this.mainPageColor} !important;
            text-decoration: underline !impoertant;
          }

          .cancel-popup:hover {
            background: ${this.mainPageColor} !important;
          }

          .dashboards__tab.js-tab-active {
            color: ${this.mainPageColor} !important;
            border-color: ${this.mainPageColor} !important;
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.1);
          }

          .dashboard-item__tags-tag {
            color: ${this.mainPageColor} !important;
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.12);
          }

          .announcements-link {
            color: ${this.mainPageColor} !important;
          }

          .pp-iframe__breadcrumbs-item {
            color: ${this.mainPageColor} !important;
          }

          .label_element_list.tags_list li {
            color: ${this.mainPageColor} !important;
            border-color: ${this.mainPageColor} !important;
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.1);
          }

          .label_element_list.tags_list li:hover {
            color: ${this.mainPageColor} !important;
            border-color: ${this.mainPageColor} !important;
            background: rgba(${rgbFormat.r},${rgbFormat.g},${rgbFormat.b}, 0.05);
          }
        </style>
      `)
    }
  }

  trackDateOnClick(element) {
    const clickDateTime = new Date();
    let formattedDateTime =
      clickDateTime.getFullYear() +
      '-' +
      (clickDateTime.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      clickDateTime.getDate().toString().padStart(2, '0') +
      ' ' +
      clickDateTime.getHours().toString().padStart(2, '0') +
      ':' +
      clickDateTime.getMinutes().toString().padStart(2, '0') +
      ':' +
      clickDateTime.getSeconds().toString().padStart(2, '0');
    return formattedDateTime;
  }

  buildSidebarBottomLinks() {
    for (const sidebarLink of this.sidebarBottomLinks) {
      $('.pp-left-bar-bottom').append(`
        <a class="pp-left-bar-bottom__link" target="_blank" href="${sidebarLink['Sidebar Bottom Url']}">
          <img class="pp-left-bar-bottom__icon" src="${sidebarLink['Sidebar Bottom Icon']}"
            alt="external sidebar link" />
          <span class="pp-left-bar-bottom__text" ${sidebarLink['Text Style'] == 'Link' ? `style="color: ${this.mainPageColor}; text-decoration: underline"` : ''}>${sidebarLink['Sidebar Bottom Text']}</span>
        </a>
      `);
    }
  }

  checkUrlElementParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const elementId = urlParams.get("id");
    const elementSegment = urlParams.get("segment");
    const elementSrc = urlParams.get("src");
    const elementType = urlParams.get("type");
    const elementName = urlParams.get("element");
    const folderName = urlParams.get("folder");

    console.log(urlParams, elementId, elementSegment, elementSrc, elementType, folderName, elementName)

    if (elementId && elementSegment && elementSrc && elementType) {

      // this.buildElementView(elementSrc, elementType, elementId, elementSegment);

      this.buildElementView(folderName, elementName);
      this.loadIframe(elementSrc);

      const newUrl = window.location.origin + window.location.pathname;
      history.pushState({}, document.title, newUrl);
    }
  }

  async checkPbiToken() {
    const profilesIds = await this.buildConnectionProfilesSet();
    // console.log('profile Ids', profilesIds);
    const urlParams = Array.from(profilesIds).join("&plugin_connection_profile_id[]=");
    // console.log('urlParams', urlParams)

    return new Promise((resolve) => {
      $.ajax({
        url: `/api/powerbi_token?plugin_connection_profile_id[]=${urlParams}`,
        type: "GET",
        dataType: "json",
        success: (res) => {
          const { data } = res;

          // console.log('Request data', data);

          for (const item of data) {
            this.connectionProfileIdsMap.set(item.plugin_connection_profile_id, item.has_token);
          }

          // console.log('Profile IDs Map', this.connectionProfileIdsMap);

          resolve();
        },
        error: (res) => {
          console.error(res);
        },
      });
    });
  }

  buildSideItem(appendType, wrapper, element) {
    const self = this;
    const contentTypeLogo = getTileExternalIconHtml(element.content_type);
    let lastViewed = '';
    let formattedDate = '';
    let extElementUrl = element.external_report_url;
    const elementId = element.element_id;
    const elementSegment = element.segment_value_id;

    const isPowerBi = element.plugin_internal_name === 'powerbi';
    const pluginId =  element.plugin_connection_profile_id ? element.plugin_connection_profile_id : undefined;
    const isPowerBiAuth =  pluginId ? self.connectionProfileIdsMap.get(pluginId) : undefined;

    const contentType = hashTable[element.element_type] || element.element_type;
    const view = contentType === "report" ? "customview" : "preview";

    if (element.last_view_time !== undefined) {
      lastViewed = element.last_view_time.split(' ')[0];
      let formatimgDate = formatDate(lastViewed);
      formattedDate = `Last viewed ${formatimgDate}`;
    } else {
      formattedDate = '';
    }

    // const iframe = `/${contentType}/index/${view}/element/${elementId}/segment/${elementSegment}/width/${self.width - 5}/height/${self.height - 25}`;
    const iframe = `/service/iframe/index/type/viewer/element/${elementId}/segment/${elementSegment}/width/${self.width - 5}/height/${self.height - 25}`;

    if (appendType === 'append') {
      $(wrapper).append(`
      <div class="side-item" 
        ${isPowerBi && pluginId ? `data-is-token="${isPowerBiAuth}" data-plugin="${element.plugin_internal_name}" 
        data-plugin-id="${pluginId}"` : ''}"
        data-element-type="${contentType}" 
        data-view-type="${view}" 
        data-segment="${element.segment_value_id}" 
        data-access="${element.has_access}" 
        data-info-id="${element.user_dashboard_element_instance_id}" 
        data-element-id="${element.element_id}" 
        data-element-name="${element.element_dashboard_name}" 
      data-iframe="${iframe}">
        <div class="displayF">
          <div class="side-item__logo">
            ${contentTypeLogo}
          </div>
          <div class="side-item__title">
            <span class="side-item__title-name">
              ${element.element_dashboard_name}
            </span>
            <span class="side-item__title-date">
              ${formattedDate}
            </span>
          </div>
        </div>
        <div class="side-item__info">
          <div class="info-btn" data-info-id="${element.user_dashboard_element_instance_id
        }">
            <img src="/pt/winbond-simplified-catalog/assets/img/info.svg" alt="" />
          </div>
        </div>
      </div>
      `);
    } else if (appendType === 'prepend') {
      $(wrapper).prepend(`
      <div class="side-item" ${isPowerBi && pluginId ? `data-is-token="${isPowerBiAuth}" data-plugin="${element.plugin_internal_name}" 
        data-plugin-id="${pluginId}"` : ''}"
        data-element-type="${contentType}" 
        data-view-type="${view}"
        data-segment="${element.segment_value_id}" 
        data-access="${element.has_access}" 
        data-info-id="${element.user_dashboard_element_instance_id}" 
        data-element-id="${element.element_id}" 
        data-element-name="${element.element_dashboard_name}" 
        data-iframe="${iframe}"
      >
        <div class="displayF">
          <div class="side-item__logo">
            ${contentTypeLogo}
          </div>
          <div class="side-item__title">
            <span class="side-item__title-name">
              ${element.element_dashboard_name}
            </span>
            <span class="side-item__title-date">
              ${formattedDate}
            </span>
          </div>
        </div>
        <div class="side-item__info">
          <div class="info-btn" data-info-id="${element.user_dashboard_element_instance_id
        }">
            <img src="/pt/winbond-simplified-catalog/assets/img/info.svg" alt="" />
          </div>
        </div>
      </div>
      `);
    }
  }

  async fetchThumbnail(element) {
    let thumbnail = '';
    try {
      thumbnail = await this.fetchElementImage(element.element_id, element.segment_value_id);
      
      return thumbnail;
    } catch (error) {
      // Handle any errors that occurred during the AJAX request.
      console.error(error);
    }
  }

  preloadThumbnails() {
    $('.dashboard-item').each((i, element) => {

      let previewImage = $(element).find('.dashboard-item__thumbnail-img');
      console.log(previewImage)

      const elementId = $(element).data('element-id');
      const elementSegment = $(element).find('.dashboard-item__main').data('segment');
      const isPowerBi = $(element).find('.dashboard-item__main').data('plugin') === 'powerbi';
      const isPowerBiAuth = $(element).find('.dashboard-item__main').data('is-token');

      if(isPowerBi && isPowerBiAuth === 'Y') {

        $(previewImage).on( "load", function() {
          console.log($(this).parent())
          
          $(this).parent().html(`<img class="dashboard-item__thumbnail-img"
            src="/content/index/preview/element/${elementId}/segment/${elementSegment}/generic/Y/dashboard/Y"
            alt="thumbnail"/>`);
        });
      }
    })

  }

  //Build Dashboard Item
  async buildDashboardItem(wrapper, element, folderName, order) {
    const self = this;
    const contentTypeLogo = getTileExternalIconHtml(element.content_type);

    const elementId = element.element_id;
    const elementSegment = element.segment_value_id;

    let extUrl = '';
    let extElementUrl = element.external_report_url;
    let lastViewed = '';
    let formattedDate = '';
    let thumbnail = '';
    let cuttedTitle = formatTitleText(element.element_dashboard_name, 21, 40);
    
    const isPowerBi = element.plugin_internal_name === 'powerbi';
    const pluginId =  element.plugin_connection_profile_id ? element.plugin_connection_profile_id : undefined;
    const isPowerBiAuth =  pluginId ? this.connectionProfileIdsMap.get(pluginId) : undefined;

    const contentType = hashTable[element.element_type] || element.element_type;
    const view = contentType === "report" ? "customview" : "preview";
    
    ///service/iframe/index/type/viewer/element/2516/width/1748/height/861
    if (element?.external_report_url) {
      extUrl = element.external_report_url;
    } else if (element.has_access === 'N') {
      extUrl = '';
    } else {
      extUrl = '#';
    }

    if (!element.last_view_time) {
      lastViewed = '';
    } else {
      lastViewed = element.last_view_time.split(' ')[0];
      let formatimgDate = formatDate(lastViewed);
      formattedDate = getDayOfWeek(formatimgDate) + ` ${formatimgDate}`;
    }

    if (element.has_access === 'Y') {

      if(isPowerBi && isPowerBiAuth === 'Y') {

        thumbnail = `<img class="dashboard-item__thumbnail-img"
        src="/content/index/thumbnail/element/${elementId}/segment/${elementSegment}/generic/Y/dashboard/Y"
        alt="thumbnail"/>`;

      } else {

        thumbnail = `<img class="dashboard-item__thumbnail-img"
        src="/content/index/thumbnail/element/${elementId}/segment/${elementSegment}/generic/Y"
        alt="thumbnail"/>`;

      }

    } else {
      thumbnail = `<div class="locked-access"></div>`;
    }

    // const iframe = `/${contentType}/index/${view}/element/${elementId}/segment/${elementSegment}/width/${self.width - 5}/height/${self.height - 25}`;
    const iframe = `/service/iframe/index/type/viewer/element/${elementId}/segment/${elementSegment}/width/${self.width - 5}/height/${self.height - 25}`;

    if (!element.in_favorites) {
      $(wrapper).append(`
      <div class="dashboard-item non-favorite" data-view-type="${view}" 
        data-access="${element.has_access}" 
        data-info-id="${element.user_dashboard_element_instance_id}" 
        data-element-id="${elementId}"
         ${order ? `style="order: ${order}"` : ''}">
              <div class="dashboard-item__upper">
                <!-- Icons "Favorite", "Link", "Info" -->
                <div class="dashboard-item__upper-left">
                  <div class="favorite-btn non-favorite" data-favorite-folder="${element.in_favorites
        }" data-element="${elementId}"
                  data-segment="${elementSegment}">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.5158 6.11898C10.1921 6.07257 9.91152 5.87079 9.7645 5.57866L8 2.0727L6.2355 5.57866C6.08848 5.87079 5.80789 6.07257 5.48416 6.11898L1.54619 6.68351L4.38266 9.39312C4.62407 9.62374 4.73447 9.95961 4.67696 10.2885L4.00677 14.1209L7.5416 12.2977C7.8292 12.1494 8.1708 12.1494 8.4584 12.2977L11.9932 14.1209L11.323 10.2885C11.2655 9.95961 11.3759 9.62374 11.6173 9.39312L14.4538 6.68351L10.5158 6.11898ZM15.1434 6.02472L15.143 6.02511L15.1434 6.02472ZM8.41698 1.24417C8.41708 1.24398 8.41718 1.24378 8.41728 1.24358L8 1.03357L8.41728 1.24358L8.41698 1.24417ZM10.6577 5.1291L8.47597 0.794022C8.38521 0.613693 8.20116 0.5 8 0.5C7.79884 0.5 7.61479 0.613693 7.52403 0.794022L5.34225 5.1291L0.457996 5.82928C0.25561 5.85829 0.0875437 6.00096 0.0253202 6.19657C-0.0369032 6.39218 0.0176668 6.6063 0.165808 6.74781L3.69191 10.1162L2.86032 14.8716C2.82529 15.0719 2.9062 15.2749 3.06919 15.3955C3.23217 15.5162 3.44912 15.5337 3.62923 15.4408L8 13.1865L12.3708 15.4408C12.5509 15.5337 12.7678 15.5162 12.9308 15.3955C13.0938 15.2749 13.1747 15.0719 13.1397 14.8716L12.3081 10.1162L15.8342 6.74781C15.9823 6.6063 16.0369 6.39218 15.9747 6.19657C15.9125 6.00096 15.7444 5.85829 15.542 5.82928L10.6577 5.1291Z"
                        fill="#222222"
                      />
                    </svg>
                  </div>
                </div>
                <div class="dashboard-item__upper-right">

                  <a href="/${contentType}/index/index/element/${elementId}/segment/${elementSegment}" target="_blank" class="link-btn" data-element-id="${elementId}" data-segment="${elementSegment}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.64">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.5 1.77614 10.7239 2 11 2H13.2929L6.14645 9.14645C5.95118 9.34171 5.95118 9.65829 6.14645 9.85355C6.34171 10.0488 6.65829 10.0488 6.85355 9.85355L14 2.70711V5C14 5.27614 14.2239 5.5 14.5 5.5C14.7761 5.5 15 5.27614 15 5V1.5C15 1.22386 14.7761 1 14.5 1H11C10.7239 1 10.5 1.22386 10.5 1.5ZM6 4C6.27614 4 6.5 3.77614 6.5 3.5C6.5 3.22386 6.27614 3 6 3H2.83333C2.3471 3 1.88079 3.19315 1.53697 3.53697C1.19316 3.88079 1 4.3471 1 4.83333V8V13.1667C1 13.6529 1.19316 14.1192 1.53697 14.463C1.88079 14.8068 2.3471 15 2.83333 15H8H11.1667C11.6529 15 12.1192 14.8068 12.463 14.463C12.8068 14.1192 13 13.6529 13 13.1667V10C13 9.72386 12.7761 9.5 12.5 9.5C12.2239 9.5 12 9.72386 12 10V13.1667C12 13.3877 11.9122 13.5996 11.7559 13.7559C11.5996 13.9122 11.3877 14 11.1667 14H8H2.83333C2.61232 14 2.40036 13.9122 2.24408 13.7559C2.0878 13.5996 2 13.3877 2 13.1667L2 7.99949L2 4.83333C2 4.61232 2.0878 4.40036 2.24408 4.24408C2.40036 4.0878 2.61232 4 2.83333 4H6Z" fill="#222222"/>
                      </g>
                    </svg>
                  </a>

                  <div class="info-btn" data-info-id="${element.user_dashboard_element_instance_id
        }">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13ZM7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM7 6C7.27614 6 7.5 6.22386 7.5 6.5V10.4062C7.5 10.6824 7.27614 10.9062 7 10.9062C6.72386 10.9062 6.5 10.6824 6.5 10.4062V6.5C6.5 6.22386 6.72386 6 7 6ZM7 3.5C6.72386 3.5 6.5 3.72386 6.5 4C6.5 4.27614 6.72386 4.5 7 4.5H7.00667C7.28281 4.5 7.50667 4.27614 7.50667 4C7.50667 3.72386 7.28281 3.5 7.00667 3.5H7Z"
                        fill="#222222"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="dashboard-item__main" ${isPowerBi && pluginId ? `data-is-token="${isPowerBiAuth}" data-plugin="${element.plugin_internal_name}" data-plugin-id="${pluginId}"` : ''} 
                data-element-type="${contentType}" 
                data-view-type="${view}" 
                data-segment="${elementSegment}" 
                data-access="${element.has_access}" 
                data-info-id="${element.user_dashboard_element_instance_id}" 
                data-folder-name="${folderName}" 
                data-element-id="${elementId}" 
                data-element-name="${element.element_dashboard_name}" 
                data-iframe="${iframe}"
              >

                <div class="dashboard-item__title">
                  ${cuttedTitle}
                </div>

                <div class="dashboard-item__tags" data-tags="[${element.topics}]"></div>

                <div class="dashboard-item__engagement">
                  ${!element.total_view_count ? '' : element.total_view_count}
                </div>

                <div class="dashboard-item__last-view">
                  ${formattedDate}
                </div>

                <div class="dashboard-item__details">
                  <div class="dashboard-item__item-content-name">${element.content_type}</div>

                  <div class="dashboard-item__logo">
                    <!-- Content logo -->
                    ${contentTypeLogo}
                  </div>
                </div>
                <div class="dashboard-item__thumbnail">
                  <!-- Thumbnail -->
                  ${thumbnail}
                </div>
              </div>
            </div>
    `);
    } else if (
      element.in_favorites &&
      element.in_favorites
        .split(',')
        .some((item) => item == self.favoritesFolder)
    ) {
      $(wrapper).append(`
      <div class="dashboard-item is-favorite" data-view-type="${view}" data-access="${element.has_access
        }" data-info-id="${element.user_dashboard_element_instance_id
        }" data-element-id="${elementId}"
        ${order ? `style="order: ${order}"` : ''}">
              <div class="dashboard-item__upper">
                <!-- Icons "Favorite", "Link", "Info" -->
                <div class="dashboard-item__upper-left">
                  <div class="favorite-btn is-favorite" data-favorite-folder="${element.in_favorites
        }" data-element="${elementId}" data-segment="${elementSegment}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_674_1924)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6577 5.1291L8.47597 0.794022C8.38521 0.613693 8.20116 0.5 8 0.5C7.79884 0.5 7.61479 0.613693 7.52403 0.794022L5.34225 5.1291L0.457996 5.82928C0.25561 5.85829 0.0875437 6.00096 0.0253202 6.19657C-0.0369032 6.39218 0.0176668 6.6063 0.165808 6.74781L3.69191 10.1162L2.86032 14.8716C2.82529 15.0719 2.9062 15.2749 3.06919 15.3955C3.23217 15.5162 3.44912 15.5337 3.62923 15.4408L8 13.1865L12.3708 15.4408C12.5509 15.5337 12.7678 15.5162 12.9308 15.3955C13.0938 15.2749 13.1747 15.0719 13.1397 14.8716L12.3081 10.1162L15.8342 6.74781C15.9823 6.6063 16.0369 6.39218 15.9747 6.19657C15.9125 6.00096 15.7444 5.85829 15.542 5.82928L10.6577 5.1291Z" fill="#FFB000"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_674_1924">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>

                  </div>
                </div>
                <div class="dashboard-item__upper-right">

                  <a href="/${contentType}/index/index/element/${elementId}/segment/${elementSegment}" target="_blank" class="link-btn" data-element-id="${elementId}" data-segment="${elementSegment}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.64">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.5 1.77614 10.7239 2 11 2H13.2929L6.14645 9.14645C5.95118 9.34171 5.95118 9.65829 6.14645 9.85355C6.34171 10.0488 6.65829 10.0488 6.85355 9.85355L14 2.70711V5C14 5.27614 14.2239 5.5 14.5 5.5C14.7761 5.5 15 5.27614 15 5V1.5C15 1.22386 14.7761 1 14.5 1H11C10.7239 1 10.5 1.22386 10.5 1.5ZM6 4C6.27614 4 6.5 3.77614 6.5 3.5C6.5 3.22386 6.27614 3 6 3H2.83333C2.3471 3 1.88079 3.19315 1.53697 3.53697C1.19316 3.88079 1 4.3471 1 4.83333V8V13.1667C1 13.6529 1.19316 14.1192 1.53697 14.463C1.88079 14.8068 2.3471 15 2.83333 15H8H11.1667C11.6529 15 12.1192 14.8068 12.463 14.463C12.8068 14.1192 13 13.6529 13 13.1667V10C13 9.72386 12.7761 9.5 12.5 9.5C12.2239 9.5 12 9.72386 12 10V13.1667C12 13.3877 11.9122 13.5996 11.7559 13.7559C11.5996 13.9122 11.3877 14 11.1667 14H8H2.83333C2.61232 14 2.40036 13.9122 2.24408 13.7559C2.0878 13.5996 2 13.3877 2 13.1667L2 7.99949L2 4.83333C2 4.61232 2.0878 4.40036 2.24408 4.24408C2.40036 4.0878 2.61232 4 2.83333 4H6Z" fill="#222222"/>
                      </g>
                    </svg>
                  </a>
                
                  <div class="info-btn" data-info-id="${element.user_dashboard_element_instance_id
        }">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13ZM7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM7 6C7.27614 6 7.5 6.22386 7.5 6.5V10.4062C7.5 10.6824 7.27614 10.9062 7 10.9062C6.72386 10.9062 6.5 10.6824 6.5 10.4062V6.5C6.5 6.22386 6.72386 6 7 6ZM7 3.5C6.72386 3.5 6.5 3.72386 6.5 4C6.5 4.27614 6.72386 4.5 7 4.5H7.00667C7.28281 4.5 7.50667 4.27614 7.50667 4C7.50667 3.72386 7.28281 3.5 7.00667 3.5H7Z"
                        fill="#222222"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="dashboard-item__main" ${isPowerBi && pluginId ? `data-is-token="${isPowerBiAuth}" data-plugin="${element.plugin_internal_name}" data-plugin-id="${pluginId}"` : ''} 
                data-element-type="${contentType}" 
                data-view-type="${view}" 
                data-segment="${elementSegment}" 
                data-access="${element.has_access}" 
                data-info-id="${element.user_dashboard_element_instance_id}" 
                data-folder-name="${folderName}" 
                data-element-name="${element.element_dashboard_name}" 
                data-element-id="${elementId}" 
                data-iframe="${iframe}"
              >
                <div class="dashboard-item__title">
                  ${cuttedTitle}
                </div>

                <div class="dashboard-item__tags" data-tags="[${element.topics}]"></div>

                <div class="dashboard-item__engagement">
                  ${!element.total_view_count ? '' : element.total_view_count}
                </div>

                <div class="dashboard-item__last-view">
                  ${formattedDate}
                </div>

                <div class="dashboard-item__details">
                  <div class="dashboard-item__item-content-name">${element.content_type}</div>

                  <div class="dashboard-item__logo">
                    <!-- Content logo -->
                    ${contentTypeLogo}
                  </div>
                </div>
                <div class="dashboard-item__thumbnail">
                  <!-- Thumbnail -->
                  ${thumbnail}
                </div>
              </div>
            </div>
    `);
    } else {
      $(wrapper).append(`
      <div class="dashboard-item" data-view-type="${view}" data-access="${element.has_access
        }" data-info-id="${element.user_dashboard_element_instance_id
        }" data-element-id="${elementId}"
        ${order ? `style="order: ${order}"` : ''}">
              <div class="dashboard-item__upper">
                <!-- Icons "Favorite", "Link", "Info" -->
                <div class="dashboard-item__upper-left">
                  <div class="favorite-btn non-favorite" data-favorite-folder="${element.in_favorites
        }" data-element="${elementId}" data-segment="${elementSegment
        }">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.5158 6.11898C10.1921 6.07257 9.91152 5.87079 9.7645 5.57866L8 2.0727L6.2355 5.57866C6.08848 5.87079 5.80789 6.07257 5.48416 6.11898L1.54619 6.68351L4.38266 9.39312C4.62407 9.62374 4.73447 9.95961 4.67696 10.2885L4.00677 14.1209L7.5416 12.2977C7.8292 12.1494 8.1708 12.1494 8.4584 12.2977L11.9932 14.1209L11.323 10.2885C11.2655 9.95961 11.3759 9.62374 11.6173 9.39312L14.4538 6.68351L10.5158 6.11898ZM15.1434 6.02472L15.143 6.02511L15.1434 6.02472ZM8.41698 1.24417C8.41708 1.24398 8.41718 1.24378 8.41728 1.24358L8 1.03357L8.41728 1.24358L8.41698 1.24417ZM10.6577 5.1291L8.47597 0.794022C8.38521 0.613693 8.20116 0.5 8 0.5C7.79884 0.5 7.61479 0.613693 7.52403 0.794022L5.34225 5.1291L0.457996 5.82928C0.25561 5.85829 0.0875437 6.00096 0.0253202 6.19657C-0.0369032 6.39218 0.0176668 6.6063 0.165808 6.74781L3.69191 10.1162L2.86032 14.8716C2.82529 15.0719 2.9062 15.2749 3.06919 15.3955C3.23217 15.5162 3.44912 15.5337 3.62923 15.4408L8 13.1865L12.3708 15.4408C12.5509 15.5337 12.7678 15.5162 12.9308 15.3955C13.0938 15.2749 13.1747 15.0719 13.1397 14.8716L12.3081 10.1162L15.8342 6.74781C15.9823 6.6063 16.0369 6.39218 15.9747 6.19657C15.9125 6.00096 15.7444 5.85829 15.542 5.82928L10.6577 5.1291Z"
                        fill="#222222"
                      />
                    </svg>
                  </div>
                </div>
                <div class="dashboard-item__upper-right">

                  <a href="/${contentType}/index/index/element/${elementId}/segment/${elementSegment}" target="_blank" class="link-btn" data-element-id="${elementId}" data-segment="${elementSegment}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.64">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.5 1.77614 10.7239 2 11 2H13.2929L6.14645 9.14645C5.95118 9.34171 5.95118 9.65829 6.14645 9.85355C6.34171 10.0488 6.65829 10.0488 6.85355 9.85355L14 2.70711V5C14 5.27614 14.2239 5.5 14.5 5.5C14.7761 5.5 15 5.27614 15 5V1.5C15 1.22386 14.7761 1 14.5 1H11C10.7239 1 10.5 1.22386 10.5 1.5ZM6 4C6.27614 4 6.5 3.77614 6.5 3.5C6.5 3.22386 6.27614 3 6 3H2.83333C2.3471 3 1.88079 3.19315 1.53697 3.53697C1.19316 3.88079 1 4.3471 1 4.83333V8V13.1667C1 13.6529 1.19316 14.1192 1.53697 14.463C1.88079 14.8068 2.3471 15 2.83333 15H8H11.1667C11.6529 15 12.1192 14.8068 12.463 14.463C12.8068 14.1192 13 13.6529 13 13.1667V10C13 9.72386 12.7761 9.5 12.5 9.5C12.2239 9.5 12 9.72386 12 10V13.1667C12 13.3877 11.9122 13.5996 11.7559 13.7559C11.5996 13.9122 11.3877 14 11.1667 14H8H2.83333C2.61232 14 2.40036 13.9122 2.24408 13.7559C2.0878 13.5996 2 13.3877 2 13.1667L2 7.99949L2 4.83333C2 4.61232 2.0878 4.40036 2.24408 4.24408C2.40036 4.0878 2.61232 4 2.83333 4H6Z" fill="#222222"/>
                      </g>
                    </svg>
                  </a>

                  <div class="info-btn" data-info-id="${element.user_dashboard_element_instance_id
        }">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13ZM7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM7 6C7.27614 6 7.5 6.22386 7.5 6.5V10.4062C7.5 10.6824 7.27614 10.9062 7 10.9062C6.72386 10.9062 6.5 10.6824 6.5 10.4062V6.5C6.5 6.22386 6.72386 6 7 6ZM7 3.5C6.72386 3.5 6.5 3.72386 6.5 4C6.5 4.27614 6.72386 4.5 7 4.5H7.00667C7.28281 4.5 7.50667 4.27614 7.50667 4C7.50667 3.72386 7.28281 3.5 7.00667 3.5H7Z"
                        fill="#222222"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="dashboard-item__main" 
                ${isPowerBi && pluginId ? `data-is-token="${isPowerBiAuth}" data-plugin="${element.plugin_internal_name}" data-plugin-id="${pluginId}"` : ''} 
                data-element-type="${contentType}" 
                data-view-type="${view}" 
                data-segment="${elementSegment}" 
                data-access="${element.has_access}" 
                data-info-id="${element.user_dashboard_element_instance_id}" 
                data-folder-name="${folderName}" 
                data-element-id="${element.element_id}" 
                data-element-name="${element.element_dashboard_name}" 
                data-iframe="${iframe}"
              >

                <div class="dashboard-item__title">
                  ${cuttedTitle}
                </div>

                <div class="dashboard-item__tags" data-tags="[${element.topics}]"></div>

                <div class="dashboard-item__engagement">
                  ${!element.total_view_count ? '' : element.total_view_count}
                </div>

                <div class="dashboard-item__last-view">
                  ${formattedDate}
                </div>

                <div class="dashboard-item__details">
                  <div class="dashboard-item__item-content-name">${element.content_type}</div>

                  <div class="dashboard-item__logo">
                    <!-- Content logo -->
                    ${contentTypeLogo}
                  </div>

                </div>

                <div class="dashboard-item__thumbnail">
                  <!-- Thumbnail -->
                  ${thumbnail}
                </div>
                
              </div>
            </div>
    `);
    }
  }

  getFolderElements(folder) {
    return this.globalFullObject.filter((elem) => {
      if (Array.isArray(elem.folder_id)) {
        return elem.folder_id.includes(folder.folder_id);
      }

      return false;
    });
  }

  getSubfolderElementsDeep(folder, acc = {}) {
    const subfolderElements = acc;

    const elements = this.getFolderElements(folder).filter(
      (el) => el.section_type == 'Category',
    );

    if (elements.length) {
      subfolderElements[folder.folder_id] = elements;
    }

    for (const sf of Object.values(folder.childs || {})) {
      this.getSubfolderElementsDeep(sf, acc);
    }

    return acc;
  }

  favoriteToggle(element, favoriteFolder) {
    const self = this;

    $(document).on('click', element, function () {
      const $this = $(this);

      if ($this.hasClass('non-favorite')) {
        $(`.favorite-btn[data-element="${$this.data('element')}"][data-segment="${$this.data('segment')}"]`).removeClass(
          'non-favorite',
        );
        $(`.favorite-btn[data-element="${$this.data('element')}"][data-segment="${$this.data('segment')}"]`).addClass(
          'is-favorite',
        );

        for (const el of self.globalFullObject) {
          if ($this.data('element') == el.element_id && $this.data('segment') == el.segment_value_id) {
            el.in_favorites = favoriteFolder;
          }
        }

        self.addToFavorite(
          favoriteFolder,
          $this.data('element'),
          $this.data('segment'),
        );
      } else if ($this.hasClass('is-favorite')) {
        $(`.favorite-btn[data-element="${$this.data('element')}"][data-segment="${$this.data('segment')}"]`).removeClass(
          'is-favorite',
        );
        $(`.favorite-btn[data-element="${$this.data('element')}"][data-segment="${$this.data('segment')}"]`).addClass(
          'non-favorite',
        );

        for (const el of self.globalFullObject) {
          if ($this.data('element') == el.element_id && $this.data('segment') == el.segment_value_id) {
            el.in_favorites = null;
          }
        }

        self.deleteFromFavorite(
          favoriteFolder,
          $this.data('element'),
          $this.data('segment'),
        );
      }
    });
  }

  getPbiToken(elementName, folderName, elementId, elementSegment, elementSrc, elementType, pluginConnectionProfileId) {
    const currentPageLinkWithAttr = encodeURIComponent(`${document.location.href}?id=${elementId}&segment=${elementSegment}&src=${elementSrc}&type=${elementType}&folder=${folderName}&element=${elementName}`);

    return new Promise((resolve) => {
      $.ajax({
        url: `/service/intermediatepage/token?per_user=Y&element_id=${elementId}`,
        success: (res) => {
          const response = JSON.parse(res);
          console.log(response)

          if (!(response && response.access_token > "")) {
            document.location.href = `/editor/service/validatepowerbioauth?user_token=Y&plugin_connection_profile_id=${pluginConnectionProfileId}&redirect_url=${currentPageLinkWithAttr}`;
            resolve("Y");
          } else {
            resolve("Y");
          }
        },
      });
    });
  }

  // Get all of the folders from the instance
  async fetchTopics(topicId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        // url: '/api/topic/id/' + topicId,
        url: '/api/topic',
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  // Get Announcement
  fetchAnnouncement() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/announcement',
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  addToFavorite(favoriteFolderId, elementId, elementSegment) {
    const self = this;
    return $.ajax({
      url: `/api/favorite_element`,
      type: 'POST',
      data: `favorite_id=${favoriteFolderId}&element_id=${elementId}&segment_value_id=${elementSegment}`,
      success: function () {
        $(`.favorite-btn[data-element="${elementId}"][data-segment="${elementSegment}"]`).html(`
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_674_1924)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6577 5.1291L8.47597 0.794022C8.38521 0.613693 8.20116 0.5 8 0.5C7.79884 0.5 7.61479 0.613693 7.52403 0.794022L5.34225 5.1291L0.457996 5.82928C0.25561 5.85829 0.0875437 6.00096 0.0253202 6.19657C-0.0369032 6.39218 0.0176668 6.6063 0.165808 6.74781L3.69191 10.1162L2.86032 14.8716C2.82529 15.0719 2.9062 15.2749 3.06919 15.3955C3.23217 15.5162 3.44912 15.5337 3.62923 15.4408L8 13.1865L12.3708 15.4408C12.5509 15.5337 12.7678 15.5162 12.9308 15.3955C13.0938 15.2749 13.1747 15.0719 13.1397 14.8716L12.3081 10.1162L15.8342 6.74781C15.9823 6.6063 16.0369 6.39218 15.9747 6.19657C15.9125 6.00096 15.7444 5.85829 15.542 5.82928L10.6577 5.1291Z" fill="#FFB000"/>
            </g>
            <defs>
            <clipPath id="clip0_674_1924">
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
          </svg>

        `);

        for (const elemObj of self.globalFullObject) {
          if (elementId == elemObj.element_id && elementSegment == elemObj.segment_value_id) {
            self.buildSideItem('prepend', $('.favorites__main'), elemObj);
            break;
          }
        }
      },
    });
  }

  deleteFromFavorite(favoriteFolderId, elementId, elementSegment) {
    return $.ajax({
      url: `/api/favorite_element?favorite_id=${favoriteFolderId}&id=${elementId}&segment_value_id=${elementSegment}`,
      type: 'DELETE',
      success: () => {
        $(`.favorite-btn[data-element="${elementId}"][data-segment="${elementSegment}"]`).html(`
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10.5158 6.11898C10.1921 6.07257 9.91152 5.87079 9.7645 5.57866L8 2.0727L6.2355 5.57866C6.08848 5.87079 5.80789 6.07257 5.48416 6.11898L1.54619 6.68351L4.38266 9.39312C4.62407 9.62374 4.73447 9.95961 4.67696 10.2885L4.00677 14.1209L7.5416 12.2977C7.8292 12.1494 8.1708 12.1494 8.4584 12.2977L11.9932 14.1209L11.323 10.2885C11.2655 9.95961 11.3759 9.62374 11.6173 9.39312L14.4538 6.68351L10.5158 6.11898ZM15.1434 6.02472L15.143 6.02511L15.1434 6.02472ZM8.41698 1.24417C8.41708 1.24398 8.41718 1.24378 8.41728 1.24358L8 1.03357L8.41728 1.24358L8.41698 1.24417ZM10.6577 5.1291L8.47597 0.794022C8.38521 0.613693 8.20116 0.5 8 0.5C7.79884 0.5 7.61479 0.613693 7.52403 0.794022L5.34225 5.1291L0.457996 5.82928C0.25561 5.85829 0.0875437 6.00096 0.0253202 6.19657C-0.0369032 6.39218 0.0176668 6.6063 0.165808 6.74781L3.69191 10.1162L2.86032 14.8716C2.82529 15.0719 2.9062 15.2749 3.06919 15.3955C3.23217 15.5162 3.44912 15.5337 3.62923 15.4408L8 13.1865L12.3708 15.4408C12.5509 15.5337 12.7678 15.5162 12.9308 15.3955C13.0938 15.2749 13.1747 15.0719 13.1397 14.8716L12.3081 10.1162L15.8342 6.74781C15.9823 6.6063 16.0369 6.39218 15.9747 6.19657C15.9125 6.00096 15.7444 5.85829 15.542 5.82928L10.6577 5.1291Z"
                        fill="#222222"/>
            </svg>
        `);

        $(`.favorites__main .side-item[data-element-id="${elementId}"][data-segment="${elementSegment}"]`).remove();
      },
    });
  }

  async recentlyViewedItems() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/element_views',
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async fetchElementExternalUrl() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/external_content`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async fetchExternalUrlDataset(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/dataset_data?dataset=${id}`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async getUser() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/index/index/user-info`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  getFavorite() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'GET',
        url: '/api/favorite',
        dataType: 'JSON',
        success: resolve,
        error: reject,
      });
    });
  }

  addEntities(entity, data, id) {
    return $.ajax({
      url: `/data/page/${this.pageInternalName}/${entity}`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        id: id,
        value: data,
      }),
    });
  }

  getEntities(entity) {
    return $.ajax({
      url: `/data/page/${this.pageInternalName}/${entity}`,
      type: 'GET',
      async: false,
    }).then((response) => {
      return response.data;
    });
  }

  updateEntity(entity, data, id) {
    return $.ajax({
      url: `/data/page/${this.pageInternalName}/${entity}?id=${id}`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
    });
  }

  dismissAnnouncementUpdate(id) {
    return $.ajax({
      url: `/api/announcement/id/${id}`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        call: 'dismiss'
      })
    });
  }

  async fetchElementImage(elementId, segmentId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/get_image?element=${elementId}&dimension_value=${segmentId}`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async fetchPluginName() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/data_source_plugin`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async fetchElementInfo(elementId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/element_info?element=${elementId}`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }

  async getBiToken(pluginId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/powerbi_token?plugin_connection_profile_id[]=${pluginId}`,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: reject,
      });
    });
  }
}
