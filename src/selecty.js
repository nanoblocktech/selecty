(function ($, window, document) {
    var slice = [].slice;
    var Selecty;
    window.Selecty = Selecty = (function () {
        Selecty.prototype.defaults = {
            dropdownParent: $('body'),
            theme: 'full',
            width: '100%',
            multiple: false,
            dropdownCssClass: '',
            selectionCssClass: '',
            title: '',
            closeText: 'Close',
            placeholder: 'Option',
            template: function (option) {
                return option.text;
            },
            initialOptions: []
        };

        function Selecty($select, options) {
            this.options = $.extend({}, this.defaults, options);
            this.prefix = 'selecty';
            this.className = 'Selecty';
            this.classPrefix = '.' + this.prefix;
            this.$select = $select;
            this.$container = $('<div class="' + this.prefix + '-container"></div>');
            this.$innerContainer = $('<div class="' + this.prefix + '-inner-container"></div>');
            this.$listGroup = $('<ul class="' + this.prefix + '-list"></ul>');
            this.isOpen = false;
            this.$parent = $(this.options.dropdownParent);
            this.itemPrefix = this.prefix + '-item';
            this.listClickable = 'li.' + this.itemPrefix;

            // Event listeners
            /*this.$select.on('click', () => {
                this.toggleList();
            });*/
            $(document).on('click', $(this.listClickable, this.$listGroup), (event) => {
                if(this.isOpen){
                    const isItem = $(event.target).closest(this.listClickable, this.$listGroup).length;
                    if(!isItem){
                        return;
                    }
                    var value = $(event.target).attr('data-value');
                    var text = $(event.target).text();
                    this.select({
                        instance: event,
                        value: value,
                        text: text
                    });
                }
            }).on('click', (e) => {
                if(!this.isOpen){
                    return;
                }
                 if (!$(e.target).closest(this.classPrefix + '-heading').length) {
                    this.closeList();
                }
            }).on('click', this.classPrefix + '-container ' + this.classPrefix +'-close', (e) => {
                e.preventDefault();
                this.closeList();
            });

            // Initial options
            if (this.options.initialOptions.length > 0) {
                this.initialOptions();
            }

            this.onCreate();
        }
 
        Selecty.prototype.onCreate = function () {
            if (!this.$select.data(this.className)) {
                this.$select.data(this.className, this);
            }

            this.$listGroup.attr({
                role: 'listbox',
                'aria-expanded': 'true',
                'aria-hidden': 'false'
            });

            this.$select.addClass(this.prefix + '-hidden-accessible');
            this.$select.trigger(this.prefix + ':created');
            
        };

        Selecty.prototype.open = function () {
            if(this.$select.is(':disabled')){
                return;
            }
            this.$select.trigger(this.prefix + ':opening');
            this.openList();
        };

        Selecty.prototype.close = function () {
            this.$select.trigger(this.prefix + ':closing');
            this.closeList();
        };

        Selecty.prototype.add = function (value, text) {
            this.addOptions(value, text);
        };

        Selecty.prototype.remove = function (value) {
            
        };

        Selecty.prototype.destroy = function () {
            this.$select.off('.' + this.className);
            this.$container.remove();
            this.$select.removeData(this.className);
            this.$select.trigger(this.prefix + ':destroy');
        };        

        // Private methods

        Selecty.prototype.select = function (param) {
            var $target = $(param.instance.target);
            this.$select.val(param.value);
            $target.attr('data-selected', 'true');
            this.$select.trigger('input').trigger('change');
            this.$select.trigger(this.prefix + ":select", [{value: param.value, text: param.text, data: param}]);
            if(this.options.multiple){

            }else{
                $target.siblings().attr('data-selected', 'false');
                this.closeList();
            }
        };

        Selecty.prototype.unselect = function (param) {
            if(this.options.multiple){

            }
        };

        Selecty.prototype.openList = function () {
            var self = this;
            this.$listGroup.add(this.$container).add(this.$innerContainer).empty();
            this.$select.attr('aria-expanded', 'true');
            this.$select.attr('aria-hidden', 'false');

            var $firstOption = this.$select.find('option:first');
            var title = '';
            
            if($firstOption.length && $firstOption.prop('disabled')){
                title = $firstOption.text() || '';
               // $firstOption.remove();
            }else{
                title = this.options.title || this.$select.attr('data-title') || '';
            }

            var $heading = $(`
                <div class="${this.prefix}-heading">
                    <span class="${this.prefix}-title">${title}</span>
                    <button type="button" class="${this.prefix}-close">${this.options.closeText}</button>
                </div>
            `);
            this.$innerContainer.append($heading);


            var run = this.$select.find('option').each((index, $option) => {
                var template = self.options.template($option);
                var $li = self.toItem(template);
                $li.attr({
                    'data-value': $option.value,
                    'data-index': index,
                    'aria-disabled':  $option.disabled,
                    'data-selected': $option.selected,
                    role: 'option'
                });

                $li.addClass(self.itemPrefix + ' ' + self.options.selectionCssClass);
                $option.setAttribute(self.itemPrefix + '-id', self.itemPrefix + '-' + index + '-' + self.newId(5))
                self.$listGroup.append($li);
            });

            
            run.promise().then(function() {
                self.$innerContainer.append(self.$listGroup);
                self.$container.html(self.$innerContainer).addClass(self.options.dropdownCssClass);
                self.$parent.append(self.$container);
                self.isOpen = true;
                self.$select.trigger(this.prefix + ':open');
            });
        };

        Selecty.prototype.toItem = function(body) {
            var $li = $('<li></li>');
            return $li.html(body);
        };

        Selecty.prototype.newId = function(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
        
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
        
            return result;
        };
          

        Selecty.prototype.toggleList = function () {
            this.isOpen ? this.closeList() : this.openList();
        };

        Selecty.prototype.closeList = function () {
            this.$container.detach();
            this.$select.attr('aria-expanded', 'false');
            this.$select.attr('aria-hidden', 'true');
            this.isOpen = false;
            this.$select.trigger(this.prefix + ':close');
        };

        Selecty.prototype.updateList = function () {
            if (this.isOpen) {
                this.openList();
            }
            this.$select.trigger(this.prefix + ':update');
        };

        Selecty.prototype.initialOptions = function () {
            this.$select.empty();
            for (var i = 0; i < this.options.initialOptions.length; i++) {
                var item = this.options.initialOptions[i];
                var option = this.option(item.value, item.text);
                this.$select.append( $(option) );
            }
            this.updateList();
        };

        Selecty.prototype.addOptions = function (value, text) {
            var option = this.option(value, text);
            this.$select.append(option);
            this.updateList();
        };

        Selecty.prototype.option = function (value, text) {
            return '<option value="' + value + '">' + text + '</option>';
        };

        return Selecty;

    })();


    return $.fn.extend({
        Selecty: function () {
            var args, option;
            option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.each(function () {
                var $this, instance;
                $this = $(this);
                instance = $this.data('Selecty');

                if (!instance) {
                    $this.data('Selecty', (instance = new Selecty($this, option)));
                }

                if (typeof option === 'string') {
                    return instance[option].apply(instance, args);
                }
            });
        }
    });

})(jQuery, window, document);
