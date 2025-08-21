// Apple macOS style interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll to sections
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add highlight effect
                targetElement.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    targetElement.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });

    // Code block copy functionality
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((block, index) => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 複製';
        copyButton.setAttribute('data-index', index);
        
        // Style the copy button
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #007aff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            opacity: 0;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        
        // Make parent container relative
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        // Show/hide copy button on hover
        block.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        block.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });
        
        // Copy functionality
        copyButton.addEventListener('click', async () => {
            const code = block.querySelector('code') || block;
            const text = code.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                copyButton.innerHTML = '✅ 已複製';
                copyButton.style.background = '#28a745';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 複製';
                    copyButton.style.background = '#007aff';
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyButton.innerHTML = '✅ 已複製';
                copyButton.style.background = '#28a745';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 複製';
                    copyButton.style.background = '#007aff';
                }, 2000);
            }
        });
    });

    // Add scroll progress indicator
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #007aff, #667eea);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    };
    
    createScrollProgress();

    // Add card animation on scroll
    const observeCards = () => {
        const cards = document.querySelectorAll('.card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };
    
    observeCards();

    // Add search functionality
    const addSearchFunctionality = () => {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜尋內容...';
        searchInput.style.cssText = `
            padding: 10px 15px;
            border: 1px solid #d2d2d7;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            outline: none;
            width: 200px;
            font-size: 14px;
            transition: all 0.2s ease;
        `;
        
        searchInput.addEventListener('focus', () => {
            searchInput.style.width = '250px';
            searchInput.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3)';
        });
        
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                searchInput.style.width = '200px';
                searchInput.style.boxShadow = 'none';
            }
        });
        
        searchContainer.appendChild(searchInput);
        document.body.appendChild(searchContainer);
        
        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                const cards = document.querySelectorAll('.card');
                
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (query === '' || text.includes(query)) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 300);
        });
    };
    
    addSearchFunctionality();

    // Add dark mode toggle
    const addDarkModeToggle = () => {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #007aff;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            transition: all 0.2s ease;
        `;
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            
            // Save preference
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // Load saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }
        
        document.body.appendChild(darkModeToggle);
    };
    
    addDarkModeToggle();

    // Add dark mode styles
    const addDarkModeStyles = () => {
        const darkModeCSS = `
            body.dark-mode {
                background-color: #1a1a1a;
                color: #ffffff;
            }
            
            body.dark-mode .card {
                background-color: #2a2a2a;
                border-color: #404040;
            }
            
            body.dark-mode .table-of-contents {
                background-color: #2a2a2a;
                border-color: #404040;
            }
            
            body.dark-mode .table-of-contents a {
                background-color: #404040;
                color: #ffffff;
            }
            
            body.dark-mode pre {
                background-color: #1e1e1e;
                border-color: #404040;
            }
            
            body.dark-mode code {
                background-color: #1e1e1e;
                border-color: #404040;
            }
            
            body.dark-mode .requirements-list {
                background-color: #404040;
            }
            
            body.dark-mode .install-order li {
                background-color: #404040;
            }
            
            body.dark-mode .footer {
                background-color: #2a2a2a;
                border-color: #404040;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = darkModeCSS;
        document.head.appendChild(style);
    };
    
    addDarkModeStyles();

    console.log('🍎 Apple macOS 風格網頁已載入完成');
});