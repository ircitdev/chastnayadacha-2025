<?php
if(!defined('ABSPATH')) exit;

$reasons = [
    "no_longer_needed" => [
        "label" => esc_html__("I do not need this plugin anymore", IPANORAMA_PLUGIN_NAME)
    ],
    "found_better" => [
        "label" => esc_html__("I found another plugin that do the job better", IPANORAMA_PLUGIN_NAME),
        "input" => esc_html__("Please tell us which one", IPANORAMA_PLUGIN_NAME)
    ],
    "how_to_use" => [
        "label" => esc_html__("I don't know how to use it", IPANORAMA_PLUGIN_NAME)
    ],
    "temporary" => [
        "label" => esc_html__("This's temporary deactivation", IPANORAMA_PLUGIN_NAME)
    ],
    "not_working" => [
        "label" => esc_html__("It's not working on my website", IPANORAMA_PLUGIN_NAME)
    ],
    "other" => [
        "label" => esc_html__("Other", IPANORAMA_PLUGIN_NAME),
        "input" => esc_html__("Please share a reason...", IPANORAMA_PLUGIN_NAME)
    ]
];
?>
<div id="ipanorama-feedback" class="ipanorama-feedback-wrap" style="display:none;">
    <div class="ipanorama-feedback">
        <div class="ipanorama-header">
            <h2 class="ipanorama-title"><?php esc_html_e("Quick Feedback", IPANORAMA_PLUGIN_NAME); ?></h2>
            <div class="ipanorama-close"></div>
        </div>
        <div class="ipanorama-data">
            <p class="ipanorama-description"><?php esc_html_e("Before you deactivate iPanorama 360 could you let us know why? Your feedback will help us improve the product, please tell us why did you decide to deactivate iPanorama 360. Thank you!", IPANORAMA_PLUGIN_NAME); ?></p>
            <div class="ipanorama-fields">
            <?php foreach($reasons as $key => $value) { ?>
                <div class="ipanorama-field">
                    <label><input type="radio" name="ipanorama-reason" value="<?php echo esc_attr($key); ?>"><?php echo esc_attr($value["label"]); ?></label>
                    <?php if(isset($value["input"])) { ?>
                        <input type="text" name="reason-<?php echo esc_attr($key); ?>" placeholder="<?php echo esc_attr($value["input"]); ?>">
                    <?php } ?>
                    <?php if(isset($value["text"])) { ?>
                        <p><?php echo $value["text"]; ?></p>
                    <?php } ?>
                </div>
            <?php } ?>
            </div>
        </div>
        <div class="ipanorama-footer">
            <div class="ipanorama-btn ipanorama-skip"><?php esc_html_e("Skip & Deactivate", IPANORAMA_PLUGIN_NAME); ?></div>
            <div class="ipanorama-btn ipanorama-submit"><?php esc_html_e("Submit & Deactivate", IPANORAMA_PLUGIN_NAME); ?></div>
        </div>
    </div>
</div>

