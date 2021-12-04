<?php

    class Model {
        public function set_properties( $props ) {
            foreach($props as $key => $value) {
                $this->{$key} = $value;
            }
        }
    }