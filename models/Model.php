<?php

    class Model {
        public function set_properties( $props, $exclude = [] ) {
            foreach($props as $key => $value) {
                if(!property_exists($this, $key) || (count($exclude) > 0 && in_array($key, $exclude)))
                    continue;
                $this->{$key} = $value;
                // echo "($this->id) - $key = $value ... " . sanitizeText($this->{$key}) . "\n";
            }
        }
    }