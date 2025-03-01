$(function() {

        "use strict";


        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            $("html").attr("class", savedTheme); // Restore theme on page load
            if (savedTheme === 'dark-theme') {
                $(".dark-mode-icon i").attr("class", "bx bx-sun");
            } else {
                $(".dark-mode-icon i").attr("class", "bx bx-moon");
            }

        } else {
            localStorage.setItem('theme', 'light-theme')

        }


        $(".dark-mode").on("click", function() {
            let currentTheme = $("html").attr("class"); // Get the current theme class

            if (currentTheme === 'dark-theme') {
                $(".dark-mode-icon i").attr("class", "bx bx-moon");
                $("html").attr("class", "light-theme");
                localStorage.setItem('theme', 'light-theme'); // Save to localStorage
                location.reload();
            } else {
                $(".dark-mode-icon i").attr("class", "bx bx-sun");
                $("html").attr("class", "dark-theme");
                localStorage.setItem('theme', 'dark-theme'); // Save to localStorage
                location.reload();
            }


            // Optional: Refresh the page to fully apply theme changes (if needed)

        });


        // new PerfectScrollbar(".app-container"),
        //     new PerfectScrollbar(".header-message-list"),
        //     new PerfectScrollbar(".header-notifications-list"),


        $(".mobile-search-icon").on("click", function() {
                $(".search-bar").addClass("full-search-bar")
            }),

            $(".search-close").on("click", function() {
                $(".search-bar").removeClass("full-search-bar")
            }),

            $(".mobile-toggle-menu").on("click", function() {
                $(".wrapper").addClass("toggled")
            }),




            $(".dark-mode").on("click", function() {

                if ($(".dark-mode-icon i").attr("class") == 'bx bx-sun') {
                    $(".dark-mode-icon i").attr("class", "bx bx-moon");
                    $("html").attr("class", "light-theme")
                } else {
                    $(".dark-mode-icon i").attr("class", "bx bx-sun");
                    $("html").attr("class", "dark-theme")
                }

            }),


            $(".toggle-icon").click(function() {
                $(".wrapper").hasClass("toggled") ? ($(".wrapper").removeClass("toggled"), $(".sidebar-wrapper").unbind("hover")) : ($(".wrapper").addClass("toggled"), $(".sidebar-wrapper").hover(function() {
                    $(".wrapper").addClass("sidebar-hovered")
                }, function() {
                    $(".wrapper").removeClass("sidebar-hovered")
                }))
            }),
            $(document).ready(function() {
                $(window).on("scroll", function() {
                    $(this).scrollTop() > 300 ? $(".back-to-top").fadeIn() : $(".back-to-top").fadeOut()
                }), $(".back-to-top").on("click", function() {
                    return $("html, body").animate({
                        scrollTop: 0
                    }, 600), !1
                })
            }),

            $(function() {
                for (var e = window.location, o = $(".metismenu li a").filter(function() {
                        return this.href == e
                    }).addClass("").parent().addClass("mm-active"); o.is("li");) o = o.parent("").addClass("mm-show").parent("").addClass("mm-active")
            }),


            $(function() {
                $("#menu").metisMenu()
            }),

            $(".chat-toggle-btn").on("click", function() {
                $(".chat-wrapper").toggleClass("chat-toggled")
            }), $(".chat-toggle-btn-mobile").on("click", function() {
                $(".chat-wrapper").removeClass("chat-toggled")
            }),


            $(".email-toggle-btn").on("click", function() {
                $(".email-wrapper").toggleClass("email-toggled")
            }), $(".email-toggle-btn-mobile").on("click", function() {
                $(".email-wrapper").removeClass("email-toggled")
            }), $(".compose-mail-btn").on("click", function() {
                $(".compose-mail-popup").show()
            }), $(".compose-mail-close").on("click", function() {
                $(".compose-mail-popup").hide()
            }),


            $(".switcher-btn").on("click", function() {
                $(".switcher-wrapper").toggleClass("switcher-toggled")
            }), $(".close-switcher").on("click", function() {
                $(".switcher-wrapper").removeClass("switcher-toggled")
            }), $("#lightmode").on("click", function() {
                $("html").attr("class", "light-theme")
            }), $("#darkmode").on("click", function() {
                $("html").attr("class", "dark-theme")
            }), $("#semidark").on("click", function() {
                $("html").attr("class", "semi-dark")
            }), $("#minimaltheme").on("click", function() {
                $("html").attr("class", "minimal-theme")
            }), $("#headercolor1").on("click", function() {
                $("html").addClass("color-header headercolor1"), $("html").removeClass("headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
            }), $("#headercolor2").on("click", function() {
                $("html").addClass("color-header headercolor2"), $("html").removeClass("headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
            }), $("#headercolor3").on("click", function() {
                $("html").addClass("color-header headercolor3"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
            }), $("#headercolor4").on("click", function() {
                $("html").addClass("color-header headercolor4"), $("html").removeClass("headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8")
            }), $("#headercolor5").on("click", function() {
                $("html").addClass("color-header headercolor5"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8")
            }), $("#headercolor6").on("click", function() {
                $("html").addClass("color-header headercolor6"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8")
            }), $("#headercolor7").on("click", function() {
                $("html").addClass("color-header headercolor7"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8")
            }), $("#headercolor8").on("click", function() {
                $("html").addClass("color-header headercolor8"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3")
            })

        // sidebar colors 
        $('#sidebarcolor1').click(theme1);
        $('#sidebarcolor2').click(theme2);
        $('#sidebarcolor3').click(theme3);
        $('#sidebarcolor4').click(theme4);
        $('#sidebarcolor5').click(theme5);
        $('#sidebarcolor6').click(theme6);
        $('#sidebarcolor7').click(theme7);
        $('#sidebarcolor8').click(theme8);

        function theme1() {
            $('html').attr('class', 'color-sidebar sidebarcolor1');
        }

        function theme2() {
            $('html').attr('class', 'color-sidebar sidebarcolor2');
        }

        function theme3() {
            $('html').attr('class', 'color-sidebar sidebarcolor3');
        }

        function theme4() {
            $('html').attr('class', 'color-sidebar sidebarcolor4');
        }

        function theme5() {
            $('html').attr('class', 'color-sidebar sidebarcolor5');
        }

        function theme6() {
            $('html').attr('class', 'color-sidebar sidebarcolor6');
        }

        function theme7() {
            $('html').attr('class', 'color-sidebar sidebarcolor7');
        }

        function theme8() {
            $('html').attr('class', 'color-sidebar sidebarcolor8');
        }


    }


);


var tabsFn = (function() {

    function init() {
        setHeight();
    }

    function setHeight() {
        var $tabPane = $('.tab-pane'),
            tabsHeight = $('.nav-tabs').height();

        $tabPane.css({
            height: tabsHeight
        });
    }

    $(init);
})();




function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function changeDirection(direction) {
    document.dir = direction; // or document.documentElement.dir
}

function setFlag(flagSrc) {
    const dropdownToggle = document.querySelector('.dropdown-laungauge .dropdown-toggle img');
    dropdownToggle.src = flagSrc;
}


function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-theme'); // Check current state

    body.classList.toggle('dark-theme', !isDarkMode); // Toggle the class

    // Store the preference in localStorage
    localStorage.setItem('dark-theme', !isDarkMode ? 'enabled' : 'disabled');

    // Get all elements you want to style dynamically (or use *)
    const elementsToStyle = document.querySelectorAll('*'); // Or a more specific selector


    elementsToStyle.forEach(element => {
        if (!isDarkMode) { // Apply dark mode styles if not already enabled
            // Store original styles
            element.dataset.originalBackgroundColor = element.style.backgroundColor;
            element.dataset.originalColor = element.style.color;

            element.style.backgroundColor = getComputedStyle(element).getPropertyValue('--dark-bg-color') || 'black';
            element.style.color = getComputedStyle(element).getPropertyValue('--dark-text-color') || 'white';

        } else { // Restore original styles if dark mode was enabled
            element.style.backgroundColor = element.dataset.originalBackgroundColor || '';
            element.style.color = element.dataset.originalColor || '';

        }
    });


}

// Add the click event listener to your button (make sure it has an ID)
const darkModeToggleButton = document.getElementById('dark-mode-toggle'); // Replace with your button's ID

if (darkModeToggleButton) {
    darkModeToggleButton.addEventListener('click', toggleDarkMode);
}


// On page load, check local storage for preference (and system preference fallback)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme === 'enabled') {
        toggleDarkMode(); // enable dark mode
    } else if (savedTheme === null && window.matchMedia && window.matchMedia('(Automatic dark mode)').matches) {
        toggleDarkMode(); //Use prefers-color-scheme if no local storage preference.
    }

});

$(document).ready(function() {
    $("#menu").metisMenu(); // Initialize metisMenu


    // Remove the default click handler on the <a> tag
    $("#menu .metismenu-item > a").off("click.metisMenu");


    // Add a click handler to the parent-icon div
    $("#menu .menu-title").on("click", function(e) {
        e.preventDefault(); // Prevent default link behavior if any
        var $parentLi = $(this).closest("li");

        // Check if the item is already active
        if ($parentLi.hasClass("mm-active")) {
            $("#menu").metisMenu('dispose'); // Dispose the metisMenu instance
            $parentLi.removeClass("mm-active"); // Deactivate parent
            $parentLi.children("ul").removeClass("mm-show"); // Hide child menu
            $parentLi.find('a').attr("aria-expanded", "false"); //update aria-expanded attr

        } else {

            // Collapse other open menus if toggle is enabled (default behavior)
            if ($("#menu").data("metisMenu").config.toggle) {
                $("#menu > li.mm-active").not($parentLi).removeClass("mm-active").find('ul.mm-show').removeClass("mm-show").end().find('a').attr("aria-expanded", "false");;
            }



            $parentLi.addClass("mm-active"); // Activate parent
            var $childUl = $parentLi.children("ul"); // Find the child 'ul'

            if ($childUl.length > 0) {
                $childUl.addClass("mm-show"); // Display the child 'ul'
                $parentLi.find('a').attr("aria-expanded", "true"); //update aria-expanded attr
            }
        }

        //  Reinitialize MetisMenu after modification
        $("#menu").metisMenu();

    });
    $("#menu .parent-icon").on("click", function(e) {
        e.preventDefault(); // Prevent default link behavior if any
        var $parentLi = $(this).closest("li");

        // Check if the item is already active
        if ($parentLi.hasClass("mm-active")) {
            $("#menu").metisMenu('dispose'); // Dispose the metisMenu instance
            $parentLi.removeClass("mm-active"); // Deactivate parent
            $parentLi.children("ul").removeClass("mm-show"); // Hide child menu
            $parentLi.find('a').attr("aria-expanded", "false"); //update aria-expanded attr

        } else {

            // Collapse other open menus if toggle is enabled (default behavior)
            if ($("#menu").data("metisMenu").config.toggle) {
                $("#menu > li.mm-active").not($parentLi).removeClass("mm-active").find('ul.mm-show').removeClass("mm-show").end().find('a').attr("aria-expanded", "false");;
            }



            $parentLi.addClass("mm-active"); // Activate parent
            var $childUl = $parentLi.children("ul"); // Find the child 'ul'

            if ($childUl.length > 0) {
                $childUl.addClass("mm-show"); // Display the child 'ul'
                $parentLi.find('a').attr("aria-expanded", "true"); //update aria-expanded attr
            }
        }

        //  Reinitialize MetisMenu after modification
        $("#menu").metisMenu();

    });


});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem, i) => {
    navItem.addEventListener("click", () => {
        navItems.forEach((item, j) => {
            item.className = "nav-item";
        });
        navItem.className = "nav-item active";
    });
});