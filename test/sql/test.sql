select
    ?,
	alpha + 1,
	beta[0] b,
	gamma['radiation'] AS g,
	case WHEN iota THEN i END
FROM (
	SELECT
		MAX(epsilon)
	FROM europe.greek.zeta
	GROUP BY $eta, iota HAVING chi, psi, phi
	UNION
	SELECT MIN(rho)
	FROM greek.omega
)
JOIN `greek_dev.sigma` ON tau = theta
WHERE kappa AND lambda OR mu
;
SELECT upsilon AS y, omicron AS o FROM xi;
