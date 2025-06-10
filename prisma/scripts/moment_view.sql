CREATE OR REPLACE VIEW moment_view AS
SELECT
    utl.user_id,
    u.username,
    ts.image_set->>'main' AS image_url,
    CONCAT('Visited ', ts.tourist_spot_name) AS description,
    CONCAT('Traveled ', utl.travel_distance, ' km') AS reward_text,
    utl.ins_date_time AS ins_date_time,
    'TRAVEL' AS moment_type
FROM user_travel_log utl
JOIN "user" u ON u.user_id = utl.user_id
JOIN tourist_spot ts ON utl.tourist_spot_id = ts.tourist_spot_id
UNION ALL
SELECT
    uql.user_id,
    u.username,
    ts.image_set->>'main' AS image_url,
    q.quest_name AS description,
    CONCAT('Earned ', q.total_magatama_point_awarded, ' PTS') AS reward_text,
    uql.completed_at AS ins_date_time,
    'QUEST' AS moment_type
FROM user_quest_log uql
JOIN "user" u ON u.user_id = uql.user_id
JOIN quest q ON uql.quest_id = q.quest_id
JOIN tourist_spot ts ON q.tourist_spot_id = ts.tourist_spot_id
WHERE uql.status = 'COMPLETED'
UNION ALL
SELECT
    usl.user_id,
    u.username,
    ts.image_set->>'main' AS image_url,
    s.story_title AS description,
    'Story completed' AS reward_text,
    usl.finished_at AS ins_date_time,
    'STORY' AS moment_type
FROM user_story_log usl
JOIN "user" u ON u.user_id = usl.user_id
JOIN story s ON usl.story_id = s.story_id
JOIN tourist_spot ts ON s.tourist_spot_id = ts.tourist_spot_id
WHERE usl.status = 'COMPLETED'
UNION ALL
SELECT
    uicl.user_id,
    u.username,
    oic.image_url,
    COALESCE(uicl.item_details, oic.nft_name, uicl.offchain_item_name) AS description,
    'Claimed item' AS reward_text,
    uicl.claimed_at AS ins_date_time,
    'ITEM' AS moment_type
FROM user_item_claim_log uicl
JOIN "user" u ON u.user_id = uicl.user_id
LEFT JOIN onchain_item_catalog oic ON uicl.onchain_item_id = oic.onchain_item_id
UNION ALL
SELECT
    uil.user_id,
    u.username,
    NULL AS image_url,
    'Invited a friend' AS description,
    CONCAT('Earned ', uil.magatama_point_awarded, ' PTS') AS reward_text,
    uil.ins_date_time AS ins_date_time,
    'INVITE' AS moment_type
FROM user_invite_log uil
JOIN "user" u ON u.user_id = uil.user_id;
