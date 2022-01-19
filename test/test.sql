select
	alpha + 1,
	beta b,
	gamma AS g,
	CASE WHEN iota THEN i END
FROM (
	SELECT
		MAX(epsilon)
	FROM zeta
	GROUP BY eta, iota HAVING chi, psi, phi
	UNION
	SELECT MIN(rho)
	FROM omega
)
JOIN sigma ON tau = theta
WHERE kappa AND lambda OR mu
;
SELECT upsilon AS y, omicron AS o FROM xi;
