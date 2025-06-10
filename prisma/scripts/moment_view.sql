CREATE OR REPLACE VIEW moment_view AS
SELECT
    MD5(CONCAT(utl.user_id, utl.ins_date_time, 'TRAVEL')) AS id,
    utl.user_id,
    u.username,
    COALESCE(ts.image_set->>'main', NULL) AS image_url,
    CONCAT('Visited ', COALESCE(ts.tourist_spot_name, 'a location')) AS description,
    CONCAT('Traveled ', COALESCE(utl.travel_distance, 0), ' km') AS reward_text,
    utl.ins_date_time AS ins_date_time,
    'TRAVEL' AS moment_type
FROM user_travel_log utl
JOIN "user" u ON u.user_id = utl.user_id
LEFT JOIN tourist_spot ts ON utl.tourist_spot_id = ts.tourist_spot_id
WHERE utl.ins_date_time IS NOT NULL
UNION ALL
SELECT
    MD5(CONCAT(uql.user_id, uql.completed_at, 'QUEST')) AS id,
    uql.user_id,
    u.username,
    COALESCE(ts.image_set->>'main', NULL) AS image_url,
    COALESCE(q.quest_name, 'Completed a quest') AS description,
    CONCAT('Earned ', COALESCE(q.total_magatama_point_awarded, 0), ' PTS') AS reward_text,
    uql.completed_at AS ins_date_time,
    'QUEST' AS moment_type
FROM user_quest_log uql
JOIN "user" u ON u.user_id = uql.user_id
LEFT JOIN quest q ON uql.quest_id = q.quest_id
LEFT JOIN tourist_spot ts ON q.tourist_spot_id = ts.tourist_spot_id
WHERE uql.status = 'COMPLETED' AND uql.completed_at IS NOT NULL
UNION ALL
SELECT
    MD5(CONCAT(usl.user_id, usl.finished_at, 'STORY')) AS id,
    usl.user_id,
    u.username,
    COALESCE(sc.chapter_image, NULL) AS image_url,
    COALESCE(sc.chapter_title, 'Story completed') AS description,
    'Story completed' AS reward_text,
    usl.finished_at AS ins_date_time,
    'STORY' AS moment_type
FROM user_story_log usl
JOIN "user" u ON u.user_id = usl.user_id
LEFT JOIN story_chapter sc ON usl.story_chapter_id = sc.story_chapter_id
LEFT JOIN story s ON sc.story_id = s.story_id
LEFT JOIN tourist_spot ts ON sc.tourist_spot_id = ts.tourist_spot_id
WHERE usl.status = 'COMPLETED' AND usl.finished_at IS NOT NULL
UNION ALL
SELECT
    MD5(CONCAT(uicl.user_id, uicl.claimed_at, 'ITEM')) AS id,
    uicl.user_id,
    u.username,
    COALESCE(oic.image_url, NULL) AS image_url,
    COALESCE(
        uicl.item_details, 
        oic.nft_name, 
        uicl.offchain_item_name, 
        'Claimed item'
    ) AS description,
    'Claimed item' AS reward_text,
    uicl.claimed_at AS ins_date_time,
    'ITEM' AS moment_type
FROM user_item_claim_log uicl
JOIN "user" u ON u.user_id = uicl.user_id
LEFT JOIN onchain_item_catalog oic ON uicl.onchain_item_id = oic.onchain_item_id
WHERE uicl.claimed_at IS NOT NULL
UNION ALL
SELECT
    MD5(CONCAT(uil.user_id, uil.ins_date_time, 'INVITE')) AS id,
    uil.user_id,
    u.username,
    NULL AS image_url,
    'Invited a friend' AS description,
    CONCAT('Earned ', COALESCE(uil.magatama_point_awarded, 0), ' PTS') AS reward_text,
    uil.ins_date_time AS ins_date_time,
    'INVITE' AS moment_type
FROM user_invite_log uil
JOIN "user" u ON u.user_id = uil.user_id
WHERE uil.ins_date_time IS NOT NULL;
